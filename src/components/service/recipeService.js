import axios from "axios";

const API_URL = "https://api.edamam.com/api/recipes/v2";

const APP_ID = 'a52b4d43';
const APP_KEY ='e0e5c667605f5e91d8275c973531b80a';

const fetchRecipes = async (query) => {
  if (!APP_ID || !APP_KEY) {
    console.error("Missing Edamam APP_ID or APP_KEY. Check your .env file.");
    return [];
  }

  try {
    const response = await axios.get(API_URL, {
      params: {
        type: "public",
        q: query,
        app_id: APP_ID,
        app_key: APP_KEY
      }
    });

    return response.data.hits || [];
  } catch (error) {
    console.error(
      `Failed to fetch ${query} recipes:`,
      error.response?.status,
      error.response?.data || error.message
    );
    return [];
  }
};

export const fetchRecipesByType = (type) => fetchRecipes(type);

export const fetchVeganRecipes = () => fetchRecipes("vegan");
export const fetchVegetarianRecipes = () => fetchRecipes("vegetarian");
export const fetchNonVegRecipes = () => fetchRecipes("chicken");
export const fetchKetoRecipes = () => fetchRecipes("keto");
export const fetchPaleoRecipes = () => fetchRecipes("paleo");