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

Your goal is to explain concepts to the user by returning a strict JSON object (NO markdown wrapping, just raw JSON).
The schema must be EXACTLY:
{{
  "summary": "A high-level explanation placed at the top of the page.",
  "inlineExplanations": [
    {{ "paragraphIndex": 0, "text": "Deep dive explanation related to paragraph 1." }}
  ]
}}
"""
        
        headers = {
            "Authorization": f"Bearer {settings.NVIDIA_NIM_API_KEY}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "z-ai/glm-5.1",
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
            resp = requests.post(nim_url, headers=headers, json=payload)
            resp.raise_for_status()
            
            data = resp.json()
            content = data["choices"][0]["message"]["content"]
            
            # For this prototype, we'll assume the LLM correctly returned JSON as a string
            import json
            try:
                # Sometimes LLMs wrap JSON in ```json ... ```
                clean_content = content.strip()
                if clean_content.startswith("```json"):
                    clean_content = clean_content[7:]
                if clean_content.endswith("```"):
                    clean_content = clean_content[:-3]
                    
                parsed_json = json.loads(clean_content)
                return Response(parsed_json)
            except json.JSONDecodeError:
                return Response({"error": "Failed to parse LLM output as JSON.", "raw": content}, status=500)
                
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
