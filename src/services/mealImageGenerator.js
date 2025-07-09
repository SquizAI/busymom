import OpenAI from 'openai';

// Check if API key is configured
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const isOpenAIConfigured = !!(OPENAI_API_KEY && 
  OPENAI_API_KEY !== 'your_openai_api_key_here' &&
  OPENAI_API_KEY.startsWith('sk-') &&
  OPENAI_API_KEY.length > 20);

// Initialize OpenAI client only if configured
let openai = null;
let openAIError = null;

if (isOpenAIConfigured) {
  try {
    openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
      dangerouslyAllowBrowser: true // Note: In production, use a backend API
    });
  } catch (error) {
    console.error('Error initializing OpenAI client:', error);
    openAIError = error;
  }
} else {
  console.warn('OpenAI API key not configured. Using fallback images.');
}

/**
 * Generate an image for a meal using OpenAI's image generation
 * @param {Object} meal - The meal object
 * @param {string} meal.name - Name of the meal
 * @param {string} meal.description - Description of the meal
 * @param {string} meal.type - Type of meal (breakfast, lunch, dinner)
 * @param {Object} options - Generation options
 * @returns {Promise<string>} - Base64 encoded image or URL
 */
export const generateMealImage = async (meal, options = {}) => {
  // If OpenAI is not configured or had initialization error, use fallback immediately
  if (!isOpenAIConfigured || !openai || openAIError) {
    return generateFallbackImage(meal);
  }

  try {
    // Construct a detailed prompt for better image generation
    const mealTypeContext = {
      breakfast: 'morning breakfast setting with natural light',
      lunch: 'midday lunch presentation',
      dinner: 'elegant dinner presentation with warm lighting'
    };

    const prompt = `A professionally photographed ${meal.name}. ${meal.description}. 
    Presented as a ${mealTypeContext[meal.type] || 'beautifully plated meal'}.
    Style: Clean, appetizing food photography with shallow depth of field.
    Setting: Modern kitchen or dining table with minimalist styling.
    Make it look delicious and Instagram-worthy.`;

    const response = await openai.images.generate({
      model: "dall-e-3", // Using DALL-E 3 for better quality
      prompt,
      n: 1,
      size: options.size || "1024x1024",
      quality: options.quality || "standard",
      response_format: options.format || "b64_json"
    });

    if (response.data && response.data[0]) {
      const imageData = response.data[0];
      
      if (options.format === "url") {
        return imageData.url;
      } else {
        // Return base64 data URL
        return `data:image/png;base64,${imageData.b64_json}`;
      }
    }

    throw new Error('No image data returned from OpenAI');
    
  } catch (error) {
    // Handle authentication errors specifically
    if (error.status === 401 || error.message?.includes('401') || error.message?.includes('Incorrect API key')) {
      console.warn('OpenAI API key is invalid. Using fallback images.');
      // Disable future attempts
      openAIError = error;
      openai = null;
    } else {
      console.error('Error generating meal image:', error);
    }
    
    // Fallback to a default image or placeholder
    return generateFallbackImage(meal);
  }
};

/**
 * Generate multiple meal images in batch
 * @param {Array} meals - Array of meal objects
 * @param {Object} options - Generation options
 * @returns {Promise<Map>} - Map of meal IDs to image URLs
 */
export const generateBatchMealImages = async (meals, options = {}) => {
  const imageMap = new Map();
  
  // Process in batches to avoid rate limits
  const batchSize = 3;
  for (let i = 0; i < meals.length; i += batchSize) {
    const batch = meals.slice(i, i + batchSize);
    
    const promises = batch.map(meal => 
      generateMealImage(meal, options)
        .then(image => ({ mealId: meal.id || `${meal.day}-${meal.type}`, image }))
        .catch(error => ({ 
          mealId: meal.id || `${meal.day}-${meal.type}`, 
          image: generateFallbackImage(meal) 
        }))
    );
    
    const results = await Promise.all(promises);
    results.forEach(({ mealId, image }) => {
      imageMap.set(mealId, image);
    });
    
    // Add a small delay between batches to respect rate limits
    if (i + batchSize < meals.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return imageMap;
};

/**
 * Edit an existing meal image (e.g., add ingredients, change style)
 * @param {string} originalImage - Base64 or URL of original image
 * @param {string} editPrompt - What to change about the image
 * @param {Object} options - Edit options
 * @returns {Promise<string>} - Edited image
 */
export const editMealImage = async (originalImage, editPrompt, options = {}) => {
  // If OpenAI is not configured, return original image
  if (!isOpenAIConfigured || !openai) {
    console.warn('OpenAI not configured. Cannot edit image.');
    return originalImage;
  }

  try {
    // Convert base64 to blob if needed
    let imageFile;
    if (originalImage.startsWith('data:')) {
      const base64Data = originalImage.split(',')[1];
      const blob = base64ToBlob(base64Data, 'image/png');
      imageFile = new File([blob], 'meal.png', { type: 'image/png' });
    } else {
      // Fetch image from URL
      const response = await fetch(originalImage);
      const blob = await response.blob();
      imageFile = new File([blob], 'meal.png', { type: 'image/png' });
    }

    const response = await openai.images.edit({
      model: "dall-e-2", // DALL-E 2 supports image editing
      image: imageFile,
      prompt: editPrompt,
      n: 1,
      size: options.size || "1024x1024",
      response_format: options.format || "b64_json"
    });

    if (response.data && response.data[0]) {
      const imageData = response.data[0];
      
      if (options.format === "url") {
        return imageData.url;
      } else {
        return `data:image/png;base64,${imageData.b64_json}`;
      }
    }

    throw new Error('No image data returned from OpenAI');
    
  } catch (error) {
    console.error('Error editing meal image:', error);
    return originalImage; // Return original on error
  }
};

/**
 * Generate a variation of an existing meal image
 * @param {string} originalImage - Base64 or URL of original image
 * @param {Object} options - Variation options
 * @returns {Promise<string>} - Image variation
 */
export const generateMealImageVariation = async (originalImage, options = {}) => {
  // If OpenAI is not configured, return original image
  if (!isOpenAIConfigured || !openai) {
    console.warn('OpenAI not configured. Cannot generate variations.');
    return originalImage;
  }

  try {
    // Convert to file format
    let imageFile;
    if (originalImage.startsWith('data:')) {
      const base64Data = originalImage.split(',')[1];
      const blob = base64ToBlob(base64Data, 'image/png');
      imageFile = new File([blob], 'meal.png', { type: 'image/png' });
    } else {
      const response = await fetch(originalImage);
      const blob = await response.blob();
      imageFile = new File([blob], 'meal.png', { type: 'image/png' });
    }

    const response = await openai.images.createVariation({
      model: "dall-e-2",
      image: imageFile,
      n: options.n || 1,
      size: options.size || "1024x1024",
      response_format: options.format || "b64_json"
    });

    if (response.data && response.data[0]) {
      const imageData = response.data[0];
      
      if (options.format === "url") {
        return imageData.url;
      } else {
        return `data:image/png;base64,${imageData.b64_json}`;
      }
    }

    throw new Error('No image data returned from OpenAI');
    
  } catch (error) {
    console.error('Error generating meal image variation:', error);
    return originalImage;
  }
};

/**
 * Generate a fallback image when OpenAI fails
 * @param {Object} meal - The meal object
 * @returns {string} - Fallback image URL
 */
const generateFallbackImage = (meal) => {
  // Use Unsplash as fallback
  const mealQuery = meal.name.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(' ')
    .slice(0, 2)
    .join('-');
  
  return `https://source.unsplash.com/400x300/?${mealQuery},food,meal`;
};

/**
 * Convert base64 string to Blob
 * @param {string} base64 - Base64 string
 * @param {string} contentType - MIME type
 * @returns {Blob} - Blob object
 */
const base64ToBlob = (base64, contentType = '') => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: contentType });
};

/**
 * Cache generated images to reduce API calls
 * @param {string} mealId - Unique meal identifier
 * @param {string} imageData - Image data to cache
 */
export const cacheMealImage = async (mealId, imageData) => {
  try {
    // Store in IndexedDB for better performance with large images
    const dbName = 'MealImageCache';
    const storeName = 'images';
    
    const db = await openIndexedDB(dbName, storeName);
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    
    const putRequest = store.put({
      id: mealId,
      image: imageData,
      timestamp: Date.now()
    });
    
    putRequest.onsuccess = async () => {
      // Clean up old images (older than 7 days)
      try {
        const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        const getAllRequest = store.getAll();
        
        getAllRequest.onsuccess = () => {
          const allImages = getAllRequest.result;
          if (Array.isArray(allImages)) {
            allImages.forEach(item => {
              if (item.timestamp < weekAgo) {
                store.delete(item.id);
              }
            });
          }
        };
      } catch (cleanupError) {
        console.error('Error cleaning up old images:', cleanupError);
      }
    };
    
  } catch (error) {
    console.error('Error caching meal image:', error);
    // Fall back to localStorage for smaller images
    try {
      localStorage.setItem(`meal-image-${mealId}`, imageData);
    } catch (e) {
      console.error('LocalStorage also failed:', e);
    }
  }
};

/**
 * Retrieve cached meal image
 * @param {string} mealId - Unique meal identifier
 * @returns {Promise<string|null>} - Cached image data or null
 */
export const getCachedMealImage = async (mealId) => {
  try {
    const dbName = 'MealImageCache';
    const storeName = 'images';
    
    const db = await openIndexedDB(dbName, storeName);
    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    
    return new Promise((resolve, reject) => {
      const getRequest = store.get(mealId);
      
      getRequest.onsuccess = () => {
        const result = getRequest.result;
        if (result && result.image) {
          resolve(result.image);
        } else {
          resolve(null);
        }
      };
      
      getRequest.onerror = () => {
        console.error('IndexedDB get error:', getRequest.error);
        // Fall back to localStorage
        resolve(localStorage.getItem(`meal-image-${mealId}`));
      };
    });
    
  } catch (error) {
    console.error('Error retrieving cached meal image:', error);
    // Fall back to localStorage
    return localStorage.getItem(`meal-image-${mealId}`);
  }
};

/**
 * Helper to open IndexedDB
 */
const openIndexedDB = (dbName, storeName) => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: 'id' });
      }
    };
  });
};

// Export a default configuration for easy setup
export const mealImageConfig = {
  model: 'dall-e-3',
  size: '1024x1024',
  quality: 'standard',
  cacheEnabled: true,
  fallbackEnabled: true
};