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
        'Edamam-Account-User': 'anugupta96', // required in v2
      },
    });
    return response.data.hits;
    console.log(`Got ${response.data.hits.length} recipes`);
  } catch (error) {
    console.error(error.response?.data || error.message);
    throw error;
  }
};
// Keep your named exports so the rest of the app still imports them
export const fetchVeganRecipes      = () => fetchRecipes('vegan');
export const fetchVegetarianRecipes = () => fetchRecipes('vegetarian');
export const fetchNonVegRecipes     = () => fetchRecipes('chicken'); // "nonvegetarian" isn't a real search term
export const fetchKetoRecipes       = () => fetchRecipes('keto');
export const fetchPaleoRecipes      = () => fetchRecipes('paleo');

const hits = await fetchVeganRecipes();
console.log(`Got ${hits.length} recipes`);
console.log(hits.slice(0, 5).map((h) => h.recipe.label));