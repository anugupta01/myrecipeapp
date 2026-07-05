import axios from 'axios';

const API_URL = 'https://api.edamam.com/api/recipes/v2';
const APP_ID = '4c41b77a';
const APP_KEY = 'e05504be57bbc714390494d91b2cd90c';

// One parameterized function instead of five copies
export const fetchRecipes = async (query) => {
  try {
    const response = await axios.get(API_URL, {
      params: {
        type: 'public',        // required in v2
        q: query,
        app_id: APP_ID,
        app_key: APP_KEY,
      },
      headers: {
        // NOTE: must be your Edamam account username from the dashboard,
        // not APP_ID. Wrong value here = 401.
        'Edamam-Account-User': APP_ID,
      },
    });
    return response.data.hits;
  } catch (error) {
    console.error(`Failed to fetch "${query}" recipes:`, error.response?.data || error.message);
    throw error;
  }
};

// Keep your named exports so the rest of the app still imports them
export const fetchVeganRecipes      = () => fetchRecipes('vegan');
export const fetchVegetarianRecipes = () => fetchRecipes('vegetarian');
export const fetchNonVegRecipes     = () => fetchRecipes('chicken');
export const fetchKetoRecipes       = () => fetchRecipes('keto');
export const fetchPaleoRecipes      = () => fetchRecipes('paleo');