import os
import sys
import json
import requests
from dotenv import load_dotenv

# Load env variables from backend/.env
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

api_key = os.environ.get('NVIDIA_NIM_API_KEY')
if not api_key:
    print("Missing NVIDIA_NIM_API_KEY")
    sys.exit(1)

# List of topics (we can extract this from src/data/topics.ts)
topics = [
  {"slug": "0a-what-is-package-json", "title": "package.json & npm"},
  {"slug": "0b-commonjs-vs-es-modules", "title": "CJS vs ESM"},
  {"slug": "0c-running-scripts", "title": "Running Scripts"},
  {"slug": "0d-basic-http-server", "title": "Basic HTTP Server"},
]

def generate_topic(topic):
    prompt = f"""
You are creating a static curriculum for a Node.js course where a user builds a Real-Time Collaborative Text Editor over 40 topics.
The user is currently on the topic: "{topic['title']}".
The editor UI has multiple files: server.js, package.json, client.js, webrtc.js, utils.js.

Generate a JSON object for this topic containing exactly this schema:
{{
  "target_file": "The file the user should edit (e.g. server.js)",
  "theory": "2-3 sentences explaining the core theory of this topic.",
  "connection": "2-3 sentences explaining EXACTLY how this topic will be used in our Real-time Text Editor project.",
  "syntax_explanation": "1-2 sentences explaining the specific syntax or API.",
  "code_example": "A specific code snippet (written as a single string, escaping newlines as \\n).",
  "challenge": "1-2 sentences giving a specific challenge to write in the editor.",
  "golden_snippet": "The EXACT code the user is expected to write to pass. This will be injected into their codebase if they pass."
}}
"""
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "meta/llama-3.1-8b-instruct",
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": 1024,
        "temperature": 0.3
    }
    resp = requests.post("https://integrate.api.nvidia.com/v1/chat/completions", headers=headers, json=payload)
    content = resp.json()["choices"][0]["message"]["content"]
    
    # Extract JSON
    start = content.find('{')
    end = content.rfind('}')
    if start != -1 and end != -1:
        return json.loads(content[start:end+1])
    return None

def main():
    curriculum = {}
    for topic in topics:
        print(f"Generating {topic['slug']}...")
        data = generate_topic(topic)
        if data:
            curriculum[topic['slug']] = data
        else:
            print(f"Failed to generate {topic['slug']}")
            
    out_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'project_curriculum.json')
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, 'w') as f:
        json.dump(curriculum, f, indent=2)
    print("Done!")

if __name__ == "__main__":
    main()
