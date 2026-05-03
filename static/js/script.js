document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const chatMessages = document.getElementById('chat-messages');
    const textInput = document.getElementById('text-input');
    const sendBtn = document.getElementById('send-btn');
    const micBtn = document.getElementById('mic-btn');
    const voiceStatus = document.getElementById('voice-status');
    const typingIndicator = document.getElementById('typing-indicator');
    const toggleVoiceBtn = document.getElementById('toggle-voice');

    // State
    let isRecording = false;
    let isVoiceOutputEnabled = true;
    let sessionId = 'session_' + Math.random().toString(36).substring(2, 9);
    
    // Web Speech API Setup
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = null;
    
    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        
        recognition.onstart = () => {
            isRecording = true;
            micBtn.classList.add('recording');
            voiceStatus.classList.add('visible');
            textInput.placeholder = 'Listening...';
        };
        
        recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';
            
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }
            
            // Show interim results in input field
            textInput.value = finalTranscript || interimTranscript;
        };
        
        recognition.onend = () => {
            isRecording = false;
            micBtn.classList.remove('recording');
            voiceStatus.classList.remove('visible');
            textInput.placeholder = 'Message Nova or click mic to speak...';
            
            // If we have text after recording stops, send it
            if (textInput.value.trim() !== '') {
                sendMessage();
            }
        };
        
        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            isRecording = false;
            micBtn.classList.remove('recording');
            voiceStatus.classList.remove('visible');
            
            if (event.error === 'network') {
                voiceStatus.textContent = 'Network Error: Please use http://localhost:5000 instead of 127.0.0.1';
            } else {
                voiceStatus.textContent = 'Error: ' + event.error;
            }
            
            setTimeout(() => {
                voiceStatus.classList.remove('visible');
                voiceStatus.textContent = 'Listening...';
            }, 5000);
        };
    } else {
        micBtn.style.display = 'none';
        console.warn('Speech Recognition API not supported in this browser.');
    }

    // Text to Speech
    const synth = window.speechSynthesis;
    let voice = null;
    
    // Load voices
    function loadVoices() {
        const voices = synth.getVoices();
        // Try to find a female English voice, fallback to any English
        voice = voices.find(v => v.lang.includes('en') && v.name.includes('Female')) || 
                voices.find(v => v.lang.includes('en')) || 
                voices[0];
    }
    
    if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = loadVoices;
    } else {
        loadVoices();
    }
    
    function speakText(text) {
        if (!isVoiceOutputEnabled || !synth) return;
        
        // Stop any current speech
        synth.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        if (voice) utterance.voice = voice;
        utterance.rate = 1.0;
        utterance.pitch = 1.1; // Slightly higher pitch for a friendly bot
        
        synth.speak(utterance);
    }

    // Toggle Voice Output
    toggleVoiceBtn.addEventListener('click', () => {
        isVoiceOutputEnabled = !isVoiceOutputEnabled;
        toggleVoiceBtn.classList.toggle('active', isVoiceOutputEnabled);
        
        if (!isVoiceOutputEnabled) {
            synth.cancel();
            toggleVoiceBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
        } else {
            toggleVoiceBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
        }
    });

    // Toggle Recording
    micBtn.addEventListener('click', () => {
        if (!recognition) return;
        
        if (isRecording) {
            recognition.stop();
        } else {
            textInput.value = '';
            recognition.start();
        }
    });

    // Send Message Handling
    sendBtn.addEventListener('click', sendMessage);
    
    textInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    async function sendMessage() {
        const message = textInput.value.trim();
        if (!message) return;
        
        // 1. Add user message to UI
        appendMessage('user', message);
        
        // 2. Clear input
        textInput.value = '';
        
        // 3. Show typing indicator
        typingIndicator.classList.remove('hidden');
        scrollToBottom();
        
        try {
            // 4. Send to backend
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    session_id: sessionId
                })
            });
            
            const data = await response.json();
            
            // 5. Hide typing indicator
            typingIndicator.classList.add('hidden');
            
            if (response.ok) {
                // 6. Show bot response
                const formattedResponse = formatBotResponse(data.response);
                appendMessage('bot', formattedResponse, true);
                
                // 7. Speak response
                // Strip HTML for speech
                const textToSpeak = data.response.replace(/<[^>]*>?/gm, '');
                speakText(textToSpeak);
            } else {
                appendMessage('bot', 'Sorry, I encountered an error: ' + (data.error || 'Unknown error'));
            }
            
        } catch (error) {
            console.error('Error:', error);
            typingIndicator.classList.add('hidden');
            appendMessage('bot', 'Network error. Please try again.');
        }
    }

    function appendMessage(sender, text, isHtml = false) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}-message`;
        
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';
        avatarDiv.innerHTML = sender === 'bot' 
            ? '<i class="fa-solid fa-robot"></i>' 
            : '<i class="fa-solid fa-user"></i>';
            
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        if (isHtml) {
            contentDiv.innerHTML = text;
        } else {
            const p = document.createElement('p');
            p.textContent = text;
            contentDiv.appendChild(p);
        }
        
        msgDiv.appendChild(avatarDiv);
        msgDiv.appendChild(contentDiv);
        
        chatMessages.appendChild(msgDiv);
        scrollToBottom();
    }
    
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Simple markdown to HTML formatter for bot responses
    function formatBotResponse(text) {
        // Replace **bold** with <strong>
        let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Replace *italic* with <em>
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        // Replace newlines with <p> tags or <br>
        html = html.split('\n\n').map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
        return html;
    }

    // Initialize toggle state
    toggleVoiceBtn.classList.add('active');
});
