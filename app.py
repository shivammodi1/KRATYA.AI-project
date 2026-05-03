import os
from flask import Flask, render_template, request, jsonify
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Configure Gemini API
# Please ensure you have GEMINI_API_KEY set in your .env file
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Initialize the Gemini model
# We'll use the recommended model for general chat
model = genai.GenerativeModel('gemini-2.5-flash')

# Store chat sessions temporarily (in production, use a database or session)
chat_sessions = {}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message')
    session_id = data.get('session_id', 'default')
    
    if not user_message:
        return jsonify({'error': 'Message is required'}), 400

    try:
        # Get or create chat session
        if session_id not in chat_sessions:
            chat_sessions[session_id] = model.start_chat(history=[])
        
        chat_session = chat_sessions[session_id]
        
        # Send message to Gemini
        response = chat_session.send_message(user_message)
        
        return jsonify({
            'response': response.text
        })
    except Exception as e:
        print(f"Error communicating with Gemini: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
