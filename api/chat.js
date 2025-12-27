// File: api/chat.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const { message, system_instruction } = req.body;
        
        // Validate
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }
        
        // Get API key
        const API_KEY = process.env.GEMINI_API_KEY;
        
        if (!API_KEY) {
            console.error('Missing API key');
            return res.status(500).json({ error: 'Server configuration error' });
        }
        
        // Prepare prompt
        const prompt = system_instruction 
            ? `${system_instruction}\n\nUser: ${message}`
            : message;
        
        // Call Gemini
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }]
                    }]
                })
            }
        );
        
        const data = await response.json();
        
        // Return response
        res.status(200).json(data);
        
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: error.message });
    }
}
