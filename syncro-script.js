// Syncro AI Chat - With FULL Website Knowledge
const API_URL = '/api/chat';
const SYSTEM_INSTRUCTION = `You are Syncro, AI assistant for RJSyncro.

=== WEBSITE KNOWLEDGE ===

ABOUT RJSYNCRO:
- Full Name: RJSyncro (One of the most trusty tech platforms)
- Tagline: "Syncing ideas across technology, design, and creative life"
- Mission: Syncing technology, creativity, and thoughts
- Stats: 42+ Articles Published, 5K+ Monthly Readers, 3 Years Writing
- Location: Chittagong, Bangladesh
- Founder: Raj (RJ) - software developer and tech researcher
- Email: rajplays66@gmail.com

WEBSITE SECTIONS:

1. HOME:
   - Hero section with tagline
   - Stats: 42+ articles, 5K+ readers, 3 years writing

2. TECH BLOG SECTION:
   - Latest technology articles and posts
   - Categories: Technology, Design, Productivity
   
   LATEST BLOG POSTS:
   a) "The Future of Web Development in 2024"
      - Category: Technology
      - Date: March 15, 2024
      - Read time: 5 min
      - Content: Exploring latest trends, frameworks, and tools shaping web development
   
   b) "Dark UI Patterns That Actually Work"
      - Category: Design
      - Date: March 10, 2024
      - Read time: 7 min
      - Content: Deep dive into effective dark mode UI patterns enhancing user experience
   
   c) "Minimalism in Digital Workspaces"
      - Category: Productivity
      - Date: March 5, 2024
      - Read time: 6 min
      - Content: How minimalist principles boost digital productivity

3. ABOUT SECTION:
   - Founder: Raj (RJ)
   - Role: Software developer, tech researcher
   - Experience: Researching tech and productivity for 2+ years
   - RJSyncro's expertise: Trust, AI & Future, Productivity, Technology, Customer comfort, Fashionable Gadgets
   - Mission: Become most demanding platform winning hearts and trust
   - Promise: Keep users two steps forward from others

4. CONTACT SECTION:
   - Email: rajplays66@gmail.com
   - Location: Chittagong, Bangladesh
   - Response time: Usually within 24 hours
   - Social media: Twitter, GitHub, LinkedIn, Instagram (links available on site)

5. PRODUCTS OFFERED:
   - Web Templates: $49-$199 (Professional website templates)
   - SaaS Starter Kit: $299 (Complete SaaS boilerplate)
   - AI Chat System: $199 one-time (Customizable AI assistant)
   - Custom Development: Custom quote (Tailored solutions)

=== YOUR ROLE & CAPABILITIES ===

YOU ARE SYNCRO AI:
- Embedded AI assistant on RJSyncro website
- Access to full website content knowledge
- Can reference specific blog posts, sections, and information
- Know company stats, founder info, and contact details
- Aware of all products and pricing

RESPONSE GUIDELINES:
1. When users ask about RJSyncro, provide accurate website information
2. Reference specific blog posts when relevant to questions
3. Mention Raj (founder) and his background when appropriate
4. For tech questions, connect to relevant blog content
5. Share contact info (email: rajplays66@gmail.com) when users want to reach out
6. Mention website stats (42+ articles, 5K+ readers) to establish credibility
7. If asked about topics covered, list the 3 main blog categories: Technology, Design, Productivity
8. For product inquiries, provide accurate pricing and descriptions

TONE & STYLE:
- Professional but friendly
- Knowledgeable about the website
- Helpful and informative
- Reference actual website content
- Proud of RJSyncro's achievements (42+ articles, 5K+ readers)
- Emphasize trust and reliability (as mentioned in website)

EXAMPLE RESPONSES:
- If asked "What is RJSyncro?": "RJSyncro is a trusted tech platform founded by Raj, featuring 42+ tech articles across Technology, Design, and Productivity categories. We have 5K+ monthly readers and aim to sync technology with creative life."
- If asked "What topics do you cover?": "Our blog covers Technology (like web development trends), Design (UI/UX patterns), and Productivity (digital workspace tips). Check out our latest post 'The Future of Web Development in 2024'."
- If asked "Who created this?": "RJSyncro was created by Raj, a software developer and tech researcher from Chittagong, Bangladesh. He's been researching tech and productivity for over 2 years."
- If asked "How to contact?": "You can email rajplays66@gmail.com or use the contact form on our website. Response time is usually within 24 hours."

IMPORTANT: You are the official AI assistant for RJSyncro website. Use your knowledge of the actual website content to provide accurate, helpful responses.`;

const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');
const typingIndicator = document.getElementById('typingIndicator');

// Send message to AI
async function sendToAI(message) {
    showTyping();
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                message: message,
                system_instruction: SYSTEM_INSTRUCTION
            })
        });
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            return data.candidates[0].content.parts[0].text;
        } else if (data.error) {
            return `API Error: ${data.error}`;
        } else {
            return "I received an unexpected response.";
        }
        
    } catch (error) {
        console.error('AI Error:', error);
        return `Connection Error: ${error.message}`;
    } finally {
        hideTyping();
    }
}

// Add message to chat
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `${sender}-message`;
    
    const senderLabel = document.createElement('strong');
    senderLabel.textContent = sender === 'user' ? 'You' : 'Syncro';
    
    const textDiv = document.createElement('div');
    textDiv.className = 'message-content';
    
    // Process text to make URLs clickable
    const processedText = makeLinksClickable(text);
    textDiv.innerHTML = processedText;
    
    messageDiv.appendChild(senderLabel);
    messageDiv.appendChild(textDiv);
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Make URLs clickable
function makeLinksClickable(text) {
    const urlRegex = /(https?:\/\/[^\s<>]+[^\s<>.,;:!?)])(?![^<]*>)/g;
    
    return text.replace(urlRegex, url => {
        const cleanUrl = url.replace(/[.,;:!?)]+$/, '');
        return `<a href="${cleanUrl}" target="_blank" rel="noopener noreferrer" 
                class="chat-link">
                ${cleanUrl}
               </a>`;
    });
}

// Show typing indicator
function showTyping() {
    if (typingIndicator) {
        typingIndicator.style.display = 'block';
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// Hide typing indicator
function hideTyping() {
    if (typingIndicator) {
        typingIndicator.style.display = 'none';
    }
}

// Send message when button clicked
sendButton.addEventListener('click', async () => {
    const message = userInput.value.trim();
    if (!message) return;
    
    addMessage(message, 'user');
    userInput.value = '';
    userInput.focus();
    
    const reply = await sendToAI(message);
    addMessage(reply, 'ai');
});

// Enter key support
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendButton.click();
    }
});

// Add CSS for links
const linkCSS = `
.chat-link {
    color: #06b6d4;
    text-decoration: underline;
    font-weight: 500;
    word-break: break-all;
    transition: color 0.2s;
}

.chat-link:hover {
    color: #22d3ee;
    text-decoration: none;
}

/* Mobile friendly */
@media (max-width: 768px) {
    .chat-link {
        font-size: 15px;
        padding: 1px 0;
    }
}
`;

// Inject CSS
if (!document.querySelector('#chat-link-styles')) {
    const style = document.createElement('style');
    style.id = 'chat-link-styles';
    style.textContent = linkCSS;
    document.head.appendChild(style);
}

// Initialize chat on load
document.addEventListener('DOMContentLoaded', () => {
    if (userInput) {
        userInput.focus();
    }
    
    setTimeout(() => {
        if (chatMessages && chatMessages.children.length === 0) {
            addMessage("Hello! I'm Syncro, AI assistant for RJSyncro. I know everything about our website - from our 42+ tech articles to our products and contact info. How can I help you explore RJSyncro today?", 'ai');
        }
    }, 800);
});

// Handle external link clicks
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('chat-link')) {
        e.preventDefault();
        window.open(e.target.href, '_blank', 'noopener,noreferrer');
    }
});
