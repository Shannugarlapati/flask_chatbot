from flask import Flask, render_template, request, jsonify
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

OPENROUTER_CONFIG = {
    "url": "https://openrouter.ai/api/v1/chat/completions",
    "headers": {
        "Authorization": f"Bearer {os.getenv('OPENAPIKEY')}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5000",
        "X-Title": "AI Chatbot"
    },
    "timeout": 20  # Slightly longer for better models
}

# Model configurations
MODELS = {
    "haiku": {
        "name": "anthropic/claude-3-haiku",
        "description": "Fast and efficient"
    },
    "sonnet": {
        "name": "anthropic/claude-3-sonnet",
        "description": "Balanced speed and intelligence (recommended)"
    },
    "opus": {
        "name": "anthropic/claude-3-opus",
        "description": "Most powerful but slower"
    }
}

@app.route('/')
def home():
    return render_template('index.html', models=MODELS)

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        user_message = data.get('message')
        model_key = data.get('model', 'sonnet')  # Default to Sonnet
        
        if not user_message:
            return jsonify({'error': 'Empty message'}), 400

        model = MODELS.get(model_key, MODELS['sonnet'])
        
        # Enhanced system prompt
        system_prompt = """You are an expert AI assistant. Provide:
- Comprehensive, accurate information
- Well-structured responses with clear organization
- Concise but thorough answers
- Use markdown formatting when helpful (**bold**, *italics*, lists, etc.)
- Include relevant details without being verbose"""

        payload = {
            "model": model['name'],
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            "temperature": 0.7,
            "max_tokens": 2000  # Allow for detailed responses
        }

        response = requests.post(
            OPENROUTER_CONFIG["url"],
            headers=OPENROUTER_CONFIG["headers"],
            json=payload,
            timeout=OPENROUTER_CONFIG["timeout"]
        )

        if response.status_code != 200:
            error_msg = response.json().get('error', {}).get('message', 'Unknown error')
            return jsonify({'error': f"API Error: {error_msg}"}), 500

        bot_response = response.json()['choices'][0]['message']['content']
        return jsonify({
            'response': bot_response,
            'model_used': model['name']
        })

    except requests.exceptions.Timeout:
        return jsonify({'error': 'The request timed out. Please try again.'}), 504
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)