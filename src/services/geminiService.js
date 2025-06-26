/**
 * Gemini API Service
 * Handles interactions with Google's Gemini AI models
 */

// Get API key from environment variables
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const modelPro = import.meta.env.AI_GEMINI_MODEL_PRO || 'gemini-2.5-pro-preview-05-06';
const modelFlash = import.meta.env.AI_GEMINI_MODEL_FLASH || 'gemini-2.5-flash-preview-04-17';

/**
 * Generate a text response from Gemini model
 * @param {string} prompt - The user's message
 * @param {string} agentType - The type of agent (assistant, nutritionist, chef, grocery)
 * @param {Array} previousMessages - Previous conversation history
 * @returns {Promise<string>} - Gemini's response
 */
export const generateResponse = async (prompt, agentType, previousMessages = []) => {
  try {
    // Format previous messages for context
    const conversationHistory = previousMessages
      .filter(msg => msg.sender !== 'system') // Filter out system messages
      .map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));
    
    // Create system prompts based on agent type
    const systemPrompts = {
      assistant: "You are a meal planning assistant for busy moms. Your expertise is in creating quick, family-friendly meals that can be prepared in under 15 minutes. Provide practical advice that's easy to follow.",
      nutritionist: "You are a nutritionist specializing in family nutrition. Provide evidence-based advice on balanced meals for families, addressing picky eaters, dietary restrictions, and nutritional needs for growing children and busy parents.",
      chef: "You are a professional chef specializing in quick, family-friendly recipes. Share cooking techniques, ingredient substitutions, and tips to elevate simple meals. Keep all advice practical for busy parents.",
      grocery: "You are a grocery shopping expert for families. Provide advice on budget-friendly shopping, meal prep, reducing food waste, and organizing shopping lists efficiently. Your focus is on practical solutions for busy families."
    };
    
    // Build the request payload
    const payload = {
      contents: [
        {
          role: "user",
          parts: [{ text: systemPrompts[agentType] || systemPrompts.assistant }]
        },
        ...conversationHistory,
        {
          role: "user", 
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 800,
      }
    };
    
    // Choose model based on agent type
    // Use Pro model for nutritionist (more scientific accuracy)
    // Use Flash model for others (faster responses)
    const model = agentType === 'nutritionist' ? modelPro : modelFlash;
    
    // Make API request
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Extract the generated text from the response
    if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts) {
      return data.candidates[0].content.parts[0].text;
    }
    
    throw new Error('Invalid response format from Gemini API');
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return "I'm having trouble connecting to my knowledge base right now. Could you try again in a moment?";
  }
};

export default {
  generateResponse
};
