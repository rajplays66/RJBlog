    // ULTRA SIMPLE WORKING VERSION
document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('sendButton');
    const input = document.getElementById('userInput');
    const messages = document.getElementById('chatMessages');
    
    if (!button || !input || !messages) {
        console.error('Missing elements! Check HTML IDs');
        return;
    }
    
    button.addEventListener('click', sendMessage);
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendMessage();
    });
    
    async function sendMessage() {
        const text = input.value.trim();
        if (!text) return;
        
        // Show user message
        addMessage('You: ' + text);
        input.value = '';
        
        // Send to AI
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({message: text})
            });
            
            const data = await response.json();
            const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
            addMessage('Syncro: ' + aiText);
            
        } catch (error) {
            addMessage('Error: ' + error.message);
        }
    }
    function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `${sender}-message`; // Creates 'user-message' or 'ai-message'
    
    // Add sender label
    const senderLabel = document.createElement('strong');
    senderLabel.textContent = sender === 'user' ? 'You' : 'Syncro';
    
    // Add message text
    const textDiv = document.createElement('div');
    textDiv.className = 'message-content';
    textDiv.textContent = text;
    
    // Assemble message
    messageDiv.appendChild(senderLabel);
    messageDiv.appendChild(textDiv);
    
    // Add to chat
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
    
