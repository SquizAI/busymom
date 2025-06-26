/**
 * OpenAI Agent Service
 * Handles interactions with OpenAI's Agent SDK for premium meal planning features
 */

import { Agent, run } from '@openai/agents';

// Initialize the OpenAI Agent
const mealPlanningAgent = new Agent({
  name: 'Meal Planning Assistant',
  instructions: 'You are a meal planning assistant. Help users create personalized meal plans based on their preferences, dietary restrictions, and available ingredients.',
  // The API key will be provided via environment variable OPENAI_API_KEY
});

/**
 * Creates or retrieves a meal planning assistant for a user
 * @param {string} userId - The user's ID
 * @returns {Promise<{assistant, thread}>} - The assistant and thread objects
 */
export const createMealPlanningAssistant = async (userId) => {
  try {
    // In the new Agent SDK, we don't need to retrieve an assistant
    // We'll just create a thread ID for the user
    const threadId = `thread_${userId}_${Date.now()}`;
    
    return { 
      thread: { id: threadId },
      assistant: mealPlanningAgent
    };
  } catch (error) {
    console.error('Error creating meal planning assistant:', error);
    throw new Error('Failed to initialize meal planning assistant');
  }
};

/**
 * Generates a meal plan based on user preferences
 * @param {string} threadId - The thread ID for the conversation
 * @param {object} userPreferences - User preferences for meal planning
 * @returns {Promise<object>} - The generated meal plan
 */
export const generateMealPlan = async (threadId, userPreferences) => {
  try {
    // Use the run function from the Agent SDK
    const result = await run(
      mealPlanningAgent,
      `Create a personalized meal plan based on these preferences: ${JSON.stringify(userPreferences)}`
    );
    
    return result.finalOutput;
  } catch (error) {
    console.error('Error generating meal plan:', error);
    throw new Error('Failed to generate meal plan');
  }
};

/**
 * Adds a message to an existing thread and gets a response
 * @param {string} threadId - The thread ID for the conversation
 * @param {string} message - The user's message
 * @returns {Promise<string>} - The assistant's response
 */
export const sendMessage = async (threadId, message) => {
  try {
    // Use the run function from the Agent SDK
    const result = await run(
      mealPlanningAgent,
      message
    );
    
    return result.finalOutput;
  } catch (error) {
    console.error('Error sending message to assistant:', error);
    throw new Error('Failed to get response from assistant');
  }
};

/**
 * Retrieves messages from a thread
 * @param {string} threadId - The thread ID
 * @returns {Promise<Array>} - The messages in the thread
 */
export const getMessages = async (threadId) => {
  try {
    // In the new Agent SDK, we would need to implement message storage ourselves
    // This is a placeholder that returns a welcome message
    return [{
      role: 'assistant',
      content: [{
        type: 'text',
        text: {
          value: "👋 Hello! I'm your premium meal planning assistant. I can help you create personalized meal plans, suggest recipes for specific dietary needs, and answer food-related questions. How can I help you today?"
        }
      }]
    }];
  } catch (error) {
    console.error('Error retrieving messages:', error);
    throw new Error('Failed to retrieve conversation history');
  }
};
