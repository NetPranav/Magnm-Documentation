from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
import requests
from .models import UserInjection, ProjectProgress

class GenerateAIView(APIView):
    def post(self, request):
        if not settings.NVIDIA_NIM_API_KEY:
            return Response(
                {"error": "NVIDIA_NIM_API_KEY is not configured on the backend."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        prompt = request.data.get('prompt')
        topic_context = request.data.get('topicContext')
        
        if not prompt:
            return Response({"error": "Prompt is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Build the prompt instructing the LLM to return JSON in a specific schema
        system_instruction = f"""
You are a highly intelligent technical documentation assistant.
The user is currently reading the topic: "{topic_context.get('title', 'Unknown')}".
Here is the context of what they are reading:
{topic_context.get('description', '')}

Paragraphs content:
{topic_context.get('paragraphs', [])}

Basic Example Code:
{topic_context.get('basicExample', '')}

Advanced Example Code:
{topic_context.get('advancedExample', '')}

Your goal is to modify and explain concepts to the user by returning a strict JSON object (NO markdown wrapping, just raw JSON).
CRITICAL JSON RULES:
1. You MUST escape all newlines inside string values as \\n. DO NOT output literal newlines inside JSON strings (e.g. inside code block replacements).
2. You MUST escape all quotes inside string values as \\".
3. DO NOT wrap the output in markdown block quotes like ```json.
The schema must be EXACTLY:
{{
  "summary": "A high-level explanation placed at the top of the page.",
  "tldr": "A dense, bullet-point TL;DR summary of the entire page if the user specifically requests a TLDR, otherwise null.",
  "inlineExplanations": [
    {{ "paragraphIndex": 0, "text": "Deep dive explanation related to paragraph index." }}
  ],
  "replacements": [
    {{ "target": "basicExample", "text": "New code block markdown to replace the basic example.", "explanation": "Detailed explanation to inject directly below the replaced code." }},
    {{ "target": "advancedExample", "text": "New code block markdown to replace the advanced example.", "explanation": "Detailed explanation to inject directly below the replaced code." }}
  ],
  "newSections": [
    {{ "title": "Line-by-line explanation", "content": "Markdown content explaining the code." }}
  ]
}}
"""
        
        headers = {
            "Authorization": f"Bearer {settings.NVIDIA_NIM_API_KEY}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "meta/llama-3.1-8b-instruct",
            "messages": [
                {"role": "system", "content": system_instruction},
                {"role": "user", "content": prompt}
            ],
            "max_tokens": 1024,
            "temperature": 0.5
        }

        try:
            # Update the URL with the correct NVIDIA NIM endpoint
            nim_url = "https://integrate.api.nvidia.com/v1/chat/completions"
            resp = requests.post(nim_url, headers=headers, json=payload, timeout=25)
            resp.raise_for_status()
            
            data = resp.json()
            content = data["choices"][0]["message"]["content"]
            
            # For this prototype, we'll assume the LLM correctly returned JSON as a string
            import json
            import json_repair
            try:
                # Robustly extract JSON object by finding first { and last }
                clean_content = content.strip()
                start = clean_content.find('{')
                end = clean_content.rfind('}')
                if start != -1 and end != -1:
                    clean_content = clean_content[start:end+1]
                    
                parsed_json = json_repair.loads(clean_content)
                return Response(parsed_json)
            except Exception as parse_err:
                return Response({"error": "Failed to parse LLM output as JSON.", "raw": content, "details": str(parse_err)}, status=500)
                
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SaveInjectionView(APIView):
    def post(self, request):
        user_email = request.data.get('email')
        topic_slug = request.data.get('topicSlug')
        history = request.data.get('history', [])
        
        if not user_email or not topic_slug:
            return Response({"error": "Email and topicSlug are required."}, status=status.HTTP_400_BAD_REQUEST)
            
        injection, created = UserInjection.objects.update_or_create(
            user_email=user_email,
            topic_slug=topic_slug,
            defaults={
                'history': history
            }
        )
        return Response({"status": "saved"})

class GetInjectionsView(APIView):
    def get(self, request):
        user_email = request.GET.get('email')
        if not user_email:
            return Response({"error": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)
            
        injections = UserInjection.objects.filter(user_email=user_email)
        result = {}
        for inj in injections:
            result[inj.topic_slug] = inj.history
        return Response(result)

class SaveProjectProgressView(APIView):
    def post(self, request):
        user_email = request.data.get('email')
        completed_topics = request.data.get('completed_topics', [])
        project_codebase = request.data.get('project_codebase', {})
        
        if not user_email:
            return Response({"error": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)
            
        progress, created = ProjectProgress.objects.update_or_create(
            user_email=user_email,
            defaults={
                'completed_topics': completed_topics,
                'project_codebase': project_codebase
            }
        )
        return Response({"status": "saved"})

class GetProjectProgressView(APIView):
    def get(self, request):
        user_email = request.GET.get('email')
        if not user_email:
            return Response({"error": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)
            
        progress = ProjectProgress.objects.filter(user_email=user_email).first()
        if not progress:
            return Response({
                "completed_topics": [],
                "project_codebase": {}
            })
            
        return Response({
            "completed_topics": progress.completed_topics,
            "project_codebase": progress.project_codebase
        })

class ProjectEvaluateView(APIView):
    def post(self, request):
        topic_slug = request.data.get('topic_slug')
        user_code = request.data.get('user_code')
        
        if not topic_slug or not user_code:
            return Response({"error": "Topic slug and user code are required."}, status=400)
            
        curriculum_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'project_curriculum.json')
        golden_snippet = ""
        target_file = "the current file"
        try:
            if os.path.exists(curriculum_path):
                with open(curriculum_path, 'r') as f:
                    curriculum = json.load(f)
                    if topic_slug in curriculum:
                        golden_snippet = curriculum[topic_slug].get("golden_snippet", "")
                        target_file = curriculum[topic_slug].get("target_file", "the current file")
        except Exception:
            pass
            
        system_instruction = f"""You are an automated code evaluator grading a student's project code.
The user was asked to write code for '{target_file}' covering the topic '{topic_slug}'.

Here is the GOLDEN STANDARD CODE for this challenge:
```javascript
{golden_snippet}
```

The user submitted this code:
```javascript
{user_code}
```

Compare the user's code to the golden standard.
If the user's code logically implements what the golden standard implements, return success: true. 
Be lenient on exact syntax/formatting, but strict on the logical requirements (e.g. if the golden code requires an import, they must have it).

You MUST return a pure JSON object:
{{
  "success": boolean,
  "feedback": "1-2 sentences of encouraging feedback. If they failed, briefly explain what is missing based on the golden standard."
}}
"""
        
        headers = {
            "Authorization": f"Bearer {settings.NVIDIA_NIM_API_KEY}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "meta/llama-3.1-8b-instruct",
            "messages": [
                {"role": "system", "content": system_instruction},
                {"role": "user", "content": f"Evaluate the submitted code."}
            ],
            "max_tokens": 512,
            "temperature": 0.3
        }
        
        try:
            nim_url = "https://integrate.api.nvidia.com/v1/chat/completions"
            resp = requests.post(nim_url, headers=headers, json=payload, timeout=25)
            resp.raise_for_status()
            
            data = resp.json()
            content = data["choices"][0]["message"]["content"]
            
            import json_repair
            try:
                clean_content = content.strip()
                start = clean_content.find('{')
                end = clean_content.rfind('}')
                if start != -1 and end != -1:
                    clean_content = clean_content[start:end+1]
                parsed = json_repair.loads(clean_content)
                
                if parsed.get("success") and golden_snippet:
                    parsed["golden_snippet"] = golden_snippet
                    parsed["target_file"] = target_file
                    
                return Response(parsed)
            except Exception as e:
                return Response({"error": "Failed to parse evaluation result.", "raw": content}, status=500)
        except Exception as e:
            return Response({"error": str(e)}, status=500)

class ProjectHintView(APIView):
    def post(self, request):
        topic_slug = request.data.get('topic_slug')
        user_code = request.data.get('user_code')
        
        if not topic_slug or not user_code:
            return Response({"error": "topic_slug and user_code are required"}, status=400)
            
        system_instruction = """You are an expert, encouraging programming mentor helping a student build a real-time collaborative text editor.
The student is stuck on their current task and asked for a hint.
DO NOT write the code for them.
Instead, briefly explain the concept they are missing, suggest what they should look at in their code, or explain why their current approach might be failing.
Keep your response under 3 sentences. Be friendly and concise.
Respond in pure JSON with EXACTLY this schema:
{
  "hint": "Your friendly hint string"
}
"""
        prompt = f"Topic: {topic_slug}\nCurrent Code:\n```javascript\n{user_code}\n```\nProvide a hint."
        
        headers = {
            "Authorization": f"Bearer {settings.NVIDIA_NIM_API_KEY}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "meta/llama-3.1-8b-instruct",
            "messages": [
                {"role": "system", "content": system_instruction},
                {"role": "user", "content": prompt}
            ],
            "max_tokens": 300,
            "temperature": 0.5
        }
        
        try:
            nim_url = "https://integrate.api.nvidia.com/v1/chat/completions"
            resp = requests.post(nim_url, headers=headers, json=payload, timeout=25)
            resp.raise_for_status()
            
            data = resp.json()
            content = data["choices"][0]["message"]["content"]
            
            import json_repair
            try:
                clean_content = content.strip()
                start = clean_content.find('{')
                end = clean_content.rfind('}')
                if start != -1 and end != -1:
                    clean_content = clean_content[start:end+1]
                parsed = json_repair.loads(clean_content)
                return Response(parsed)
            except Exception as e:
                return Response({"error": "Failed to parse hint result.", "raw": content}, status=500)
        except Exception as e:
            return Response({"error": str(e)}, status=500)

class ProjectChallengeView(APIView):
    def post(self, request):
        topic_slug = request.data.get('topic_slug')
        
        if not topic_slug:
            return Response({"error": "Topic slug is required."}, status=400)
            
        curriculum_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'project_curriculum.json')
        if not os.path.exists(curriculum_path):
            return Response({"error": "Curriculum data not found. Please run the generation script."}, status=500)
            
        try:
            with open(curriculum_path, 'r') as f:
                curriculum = json.load(f)
                
            if topic_slug in curriculum:
                return Response(curriculum[topic_slug])
            else:
                return Response({
                    "theory": "This topic is currently under construction.",
                    "connection": "We are actively building the Golden Master for this section.",
                    "syntax_explanation": "Please bear with us.",
                    "challenge": "Please skip to a different topic for now while the curriculum is generated."
                })
        except Exception as e:
            return Response({"error": str(e)}, status=500)
