// ========= SYNCRO AI CHATBOT SCRIPT =========
// SECURE VERSION - No API keys exposed
const API_URL = '/api/chat';  // Calls our secure backend

// DOM Elements
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');
const typingIndicator = document.getElementById('typingIndicator');

// System Instruction to train Syncro
const SYSTEM_INSTRUCTION = `You are Syncro, the advanced AI assistant for RJSyncro tech blog.

# ABOUT RJSYNCRO:
- Website: RJSyncro (rjblog.vercel.app)
- Creator: RJ (Raj)
- Tagline: "Welcome to the best tech web"
- Theme: Dark mode with cyan/blue accent colors
- Topics: Web Development, UI/UX Design, Productivity, Tech Trends, Coding Tutorials

# YOUR CAPABILITIES:
1. Tech Support - Help with coding, debugging, best practices
2. Explanations - Explain tech concepts simply
3. Recommendations - Suggest tools and resources
4. Tutorials - Step-by-step guides
5. Trends - Latest tech innovations

# RESPONSE GUIDELINES:
- Be clear, concise, and structured
- Use markdown for code and lists
- Admit when you don't know something
- Stay enthusiastic but professional

Start with a warm greeting and offer help with RJSyncro topics or general tech questions.`;

// Function to add a message to the chat
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const senderDiv = document.createElement('div');
    senderDiv.className = 'message-sender';
    senderDiv.innerHTML = sender === 'user'
        ? '<i class="fas fa-user"></i> You'
        : '<img src="https://i.ibb.co/bgcqhbsW/unnamed-removebg-preview.png" class="message-avatar"> Syncro';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    // Handle line breaks in the text
    const paragraphs = text.split('\n').filter(p => p.trim() !== '');
    paragraphs.forEach(p => {
        const pElem = document.createElement('p');
        pElem.textContent = p;
        contentDiv.appendChild(pElem);
    });
    
    messageDiv.appendChild(senderDiv);
    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);
    
    // Scroll to the bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to show/hide the typing indicator
function showTyping() {
    typingIndicator.style.display = 'flex';
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTyping() {
    typingIndicator.style.display = 'none';
}

// Function to send message to AI
async function sendToAI(userMessage) {
    showTyping();
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: userMessage,
                system_instruction: SYSTEM_INSTRUCTION
            })
        });
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        hideTyping();
        
        // Extract AI response from Gemini API
        let aiResponse = '';
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            aiResponse = data.candidates[0].content.parts[0].text;
        } else {
            aiResponse = "Sorry, I couldn't process that response.";
        }
        
        addMessage(aiResponse, 'ai');
        
    } catch (error) {
        hideTyping();
        addMessage(`Error: ${error.message}. Please try again.`, 'ai');
        console.error('AI Error:', error);
    }
}

// Function to handle sending messages
function handleSendMessage() {
    const message = userInput.value.trim();
    
    if (message === '') return;
    
    // Add user message
    addMessage(message, 'user');
    
    // Clear input
    userInput.value = '';
    
    // Send to AI
    sendToAI(message);
}

// Event Listeners
sendButton.addEventListener('click', handleSendMessage);

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
    }
});

// Initial greeting
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        addMessage("Hello! I'm Syncro, your AI assistant for RJSyncro tech blog. How can I help you today?", 'ai');
    }, 500);
});
