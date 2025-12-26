// SIMPLE VERSION - NO ERRORS
const API_URL = '/api/chat';

const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');

async function sendToAI(message) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({message: message})
    });
    
    const data = await response.json();
    
    if (data.candidates && data.candidates[0]) {
        return data.candidates[0].content.parts[0].text;
    }
    return "Error: No response";
}

function addMessage(text, sender) {
    const div = document.createElement('div');
    div.className = sender + '-message';
    div.textContent = text;
    chatMessages.appendChild(div);
}

sendButton.addEventListener('click', async () => {
    const message = userInput.value;
    addMessage(message, 'user');
    userInput.value = '';
    
    const reply = await sendToAI(message);
    addMessage(reply, 'ai');
});
