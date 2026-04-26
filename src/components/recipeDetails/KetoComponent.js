import React, { useState, useEffect } from "react";
import { fetchKetoRecipes } from "../service/recipeService";
import "./Vegan.css";
import { useNavigate } from "react-router-dom";
import Button from "../CommonUI/Button";

const KetoComponent = () => {
  const navigate = useNavigate();

  const [recipes, setRecipes] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const back = () => {
    navigate("/dashboard");
  };

  useEffect(() => {
    const getRecipes = async () => {
      try {
        const recipeData = await fetchKetoRecipes();
        setRecipes(recipeData);
      } catch (error) {
        setError("Failed to fetch recipes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    getRecipes();
  }, []);

  const filteredRecipes = recipes.filter((item) => {
    const recipe = item.recipe;

    const searchValue = searchText.toLowerCase();

    const matchesSearch =
      recipe.label.toLowerCase().includes(searchValue) ||
      recipe.source.toLowerCase().includes(searchValue) ||
      recipe.ingredientLines.some((ingredient) =>
        ingredient.toLowerCase().includes(searchValue)
      );

    let matchesFilter = true;

    if (filterType === "low-calorie") {
      matchesFilter = recipe.calories < 500;
    } else if (filterType === "high-protein") {
      matchesFilter = recipe.totalNutrients?.PROCNT?.quantity > 20;
    } else if (filterType === "quick") {
      matchesFilter = recipe.totalTime > 0 && recipe.totalTime <= 30;
    }

    return matchesSearch && matchesFilter;
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="vegan-recipes">
      <h1>Keto Recipes</h1>

      <Button className="btn btn-back" onClick={back}>
        Back
      </Button>

      <div className="search-filter-container">
        <input
          type="text"
          placeholder="Search by recipe, source, or ingredient..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="search-input"
        />

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Recipes</option>
          <option value="low-calorie">Low Calorie</option>
          <option value="high-protein">High Protein</option>
          <option value="quick">Quick Recipes</option>
        </select>
      </div>

      <div className="recipe-list">
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map((item) => {
            const recipe = item.recipe;

            return (
              <div key={recipe.uri} className="recipe-card">
                <h2>{recipe.label}</h2>
                <p>{recipe.source}</p>
                <img src={recipe.image} alt={recipe.label} />

                <p>
                  <strong>Calories:</strong> {Math.round(recipe.calories)}
                </p>

                <p>
                  <strong>Protein:</strong>{" "}
                  {recipe.totalNutrients?.PROCNT?.quantity
                    ? Math.round(recipe.totalNutrients.PROCNT.quantity)
                    : 0}
                  g
                </p>

                <p>
                  <strong>Time:</strong>{" "}
                  {recipe.totalTime > 0 ? `${recipe.totalTime} mins` : "N/A"}
                </p>

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
          <p>No matching keto recipes found.</p>
        )}
      </div>
    </div>
  );
};

export default KetoComponent;