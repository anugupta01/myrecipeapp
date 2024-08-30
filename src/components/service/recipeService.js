import axios from 'axios';

const API_URL = 'https://api.edamam.com/search';
const APP_ID = 'a52b4d43';
const APP_KEY = 'e0e5c667605f5e91d8275c973531b80a';

export const fetchVeganRecipes = async () => {
    try {
      const response = await axios.get(API_URL, {
        params: {
          q: 'vegan',
          app_id: APP_ID,
          app_key: APP_KEY
        }
      });
      return response.data.hits;
    } catch (error) {
      console.error('Failed to fetch keto recipes:', error);
      throw error;
    }
  };

  export const fetchVegetarianRecipes = async () => {
    try {
      const response = await axios.get(API_URL, {
        params: {
          q: 'vegetarian',
          app_id: APP_ID,
          app_key: APP_KEY
        }
      });
      return response.data.hits;
    } catch (error) {
      console.error('Failed to fetch keto recipes:', error);
      throw error;
    }
  };

  export const fetchNonVegRecipes = async () => {
    try {
      const response = await axios.get(API_URL, {
        params: {
          q: 'nonvegetarian',
          app_id: APP_ID,
          app_key: APP_KEY
        }
      });
      return response.data.hits;
    } catch (error) {
      console.error('Failed to fetch keto recipes:', error);
      throw error;
    }
  };

export const fetchKetoRecipes = async () => {
  try {
    const response = await axios.get(API_URL, {
      params: {
        q: 'keto',
        app_id: APP_ID,
        app_key: APP_KEY
      }
    });
    return response.data.hits;
  } catch (error) {
    console.error('Failed to fetch keto recipes:', error);
    throw error;
  }
};

export const fetchPaleoRecipes = async () => {
    try {
      const response = await axios.get(API_URL, {
        params: {
          q: 'paleo',
          app_id: APP_ID,
          app_key: APP_KEY
        }
      });
      return response.data.hits;
    } catch (error) {
      console.error('Failed to fetch keto recipes:', error);
      throw error;
    }
  };