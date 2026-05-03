# Nova AI - Voice Chatbot

A modern, interactive AI voice chatbot built with Flask and the Gemini API. It features a beautiful glassmorphism UI, real-time speech recognition (Speech-to-Text), and speech synthesis (Text-to-Speech) using the native Web Speech API.

## Features
- **Gemini Powered**: Uses Google's `gemini-1.5-flash` model for intelligent, context-aware conversations.
- **Voice Interactions**: Speak to the bot using your microphone and hear its responses out loud.
- **Modern UI**: Clean, dynamic, and responsive glassmorphism design with CSS animations.
- **Real-time Status**: Visual indicators for listening, processing, and network states.

---

## 🛠️ Local Setup Instructions

### 1. Prerequisites
- Python 3.8+
- A Google Gemini API Key. You can get one from [Google AI Studio](https://aistudio.google.com/app/apikey).

### 2. Installation
Clone the repository (or copy the files) and navigate to the project directory:

```bash
cd ShivamProject
```

Install the required Python dependencies:
```bash
pip install -r requirements.txt
```

### 3. Environment Configuration
Create a `.env` file in the root directory. You can rename the provided `.env.example` file:
```bash
cp .env.example .env
```

Open the `.env` file and add your API key:
```ini
GEMINI_API_KEY=your_actual_api_key_here
```

### 4. Running the App locally
Start the Flask development server:
```bash
python app.py
```

**Important**: Open your browser and navigate to **[http://localhost:5000](http://localhost:5000)**. 
*(Note: Do not use `127.0.0.1` as browsers require `localhost` to allow the microphone permissions securely without HTTPS).*

---

## 🚀 Deployment Instructions (Render)

This project is fully ready to be deployed on [Render](https://render.com/).

### 1. Push to GitHub
First, make sure your code is pushed to a GitHub repository. (Do **not** commit your `.env` file!).

### 2. Create a Web Service on Render
1. Log in to Render and click **New+** -> **Web Service**.
2. Connect your GitHub account and select your project repository.
3. Configure the service with the following settings:
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`

### 3. Add Environment Variables
Before deploying, scroll down to the **Environment Variables** section on Render and add your API key:
- **Key**: `GEMINI_API_KEY`
- **Value**: `your_actual_api_key_here`

### 4. Deploy!
Click **Create Web Service**. Render will now install your dependencies and launch the app via Gunicorn. Once finished, you will receive a public `https://...onrender.com` URL. Since Render provides an SSL certificate (HTTPS), the Web Speech API will work flawlessly!
