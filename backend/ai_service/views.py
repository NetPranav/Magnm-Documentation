from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
import requests
from .models import UserInjection

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
            "model": "meta/llama-3.1-70b-instruct",
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
            resp = requests.post(nim_url, headers=headers, json=payload, timeout=30)
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
