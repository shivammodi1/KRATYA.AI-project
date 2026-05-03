# Nova AI - Voice Chatbot

A modern, interactive AI voice chatbot built with Flask and the Gemini API. It features a beautiful glassmorphism UI, real-time speech recognition (Speech-to-Text), and speech synthesis (Text-to-Speech) using the native Web Speech API.

## 🚀 Live Demo

👉 https://supportive-smile-production-1e4f.up.railway.app/

---

## ✨ Features

* **Gemini Powered**: Uses Google's `gemini-1.5-flash` model for intelligent, context-aware conversations.
* **Voice Interactions**: Speak to the bot using your microphone and hear responses out loud.
* **Modern UI**: Clean, dynamic, and responsive glassmorphism design.
* **Real-time Status**: Visual indicators for listening, processing, and network states.

---

## 🛠️ Local Setup Instructions

### 1. Prerequisites

* Python 3.8+
* A Google Gemini API Key from https://aistudio.google.com/app/apikey

---

### 2. Installation

```bash
cd ShivamProject
pip install -r requirements.txt
```

---

### 3. Environment Setup

Create `.env` file:

```ini
GEMINI_API_KEY=your_actual_api_key_here
```

---

### 4. Run Locally

```bash
python app.py
```

Open in browser:
👉 http://localhost:5000

---

## ☁️ Deployment (Railway)

This project is deployed using Railway.

### Steps to Deploy:

1. Push code to GitHub
2. Go to Railway → New Project
3. Select GitHub repo
4. Railway auto-detects Python app

---

### ⚙️ Configuration

* **Build Command**

```bash
pip install -r requirements.txt
```

* **Start Command**

```bash
gunicorn app:app
```

---

### 🔐 Environment Variables

Add in Railway dashboard:

```
GEMINI_API_KEY=your_actual_api_key
```

---

## ⚠️ Important Notes

* Microphone access works only on **HTTPS** (Railway supports it ✅)
* Do not commit `.env` file
* Use `localhost` for local testing (not 127.0.0.1)

---

## 🧠 Tech Stack

* Backend: Flask
* AI: Google Gemini API
* Frontend: HTML, CSS, JavaScript
* Voice: Web Speech API

---

## 💥 Future Improvements

* Chat history (database)
* User authentication
* Wake word detection
* Multi-language support

---

## 👨‍💻 Author

Shivam Modi
