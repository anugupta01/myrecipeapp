import React, { useState, useEffect } from "react";
import { fetchVegetarianRecipes } from '../service/recipeService';
import "./Vegan.css";
import { useNavigate } from "react-router-dom";
import Button from "../CommonUI/Button";

const VegetarianComponent = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const back = () => {
    navigate("/dashboard");
  };

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const recipeData = await fetchVegetarianRecipes();
        setRecipes(recipeData);
      } catch (error) {
        setError("Failed to fetch recipes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
    
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="vegan-recipes">
      <h1>Vegetarian Recipes</h1>
      <Button className="btn btn-back" onClickCapture={back}>Back</Button>
      <div className="recipe-list">
      {recipes.length > 0 ? (
          recipes.map((item) => {
            const recipe = item.recipe;
            return (
              <div key={recipe.uri} className="recipe-card">
                <h2>{recipe.label}</h2>
                <p>{recipe.source}</p>
                <img src={recipe.image} alt={recipe.label} />
                <div className="recipe-details">
                  <h3>Ingredients:</h3>
                  <ul>
                    {recipe.ingredientLines.map((line, index) => (
                      <li key={index}>{line}</li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })
        ) : (
          <p>No vegetarian recipes found.</p>
        )}
      </div>
    </div>
  );
};

export default VegetarianComponent;