export const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

export const validateApiKey = (): boolean => {
    if (!API_KEY) {
        console.error('Gemini API key is not set. Please add VITE_GEMINI_API_KEY to your .env file.');
        return false;
    }
    return true;
};
