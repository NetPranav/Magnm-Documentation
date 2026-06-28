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
            return Response({"error": "topic_slug and user_code are required"}, status=400)
            
        system_instruction = """You are an expert programming instructor evaluating a student's code submission for a real-time collaborative text editor project.
You will be given the topic they are currently learning, and their code submission.
Evaluate if their code correctly implements the concepts required for this topic.
Respond in pure JSON with EXACTLY this schema:
{
  "success": boolean (true if the code is acceptable, false if it is wrong or missing key concepts),
  "feedback": "String explaining what they did well, or what they did wrong. Keep it encouraging and specific."
}
"""
        prompt = f"Topic: {topic_slug}\nUser Code Submission:\n```javascript\n{user_code}\n```\nEvaluate this submission."
        
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
        topic_title = request.data.get('topic_title')
        topic_desc = request.data.get('topic_description')
        
        if not topic_slug:
            return Response({"error": "topic_slug is required"}, status=400)
            
        system_instruction = """You are an expert programming instructor guiding a student through building a Real-time Collaborative Text Editor in Node.js.
The student is currently learning a specific topic.
You must provide the instructions for this stage of the project in pure JSON with EXACTLY this schema:
{
  "theory": "2-3 sentences explaining the core theory of this topic.",
  "connection": "2-3 sentences explaining EXACTLY how this topic will be used in our Real-time Text Editor project.",
  "challenge": "1-2 sentences giving the user a specific, implementable coding challenge to write in their editor right now to progress the project."
}
"""
        prompt = f"Topic: {topic_title}\nDescription: {topic_desc}\nProvide the project challenge instructions."
        
        headers = {
            "Authorization": f"Bearer {settings.NVIDIA_API_KEY}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "meta/llama-3.1-8b-instruct",
            "messages": [
                {"role": "system", "content": system_instruction},
                {"role": "user", "content": prompt}
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
                return Response(parsed)
            except Exception as e:
                return Response({"error": "Failed to parse challenge result.", "raw": content}, status=500)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
