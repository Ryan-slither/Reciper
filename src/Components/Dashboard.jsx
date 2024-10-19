import "./Dashboard.css";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import loggedInContext from "./loggedInContext";
import { useNavigate } from "react-router-dom";
import userIdContext from "./userIdContext";
import Recipe from "./Recipe";
import Search from "./Search";

function Dashboard() {
  const navigate = useNavigate();
  const { isLogged, setIsLogged } = useContext(loggedInContext);
  const { userId, setUserId } = useContext(userIdContext);
  const [recipes, setRecipes] = useState([]);
  const [bookRecipes, setBookRecipes] = useState([]);
  const [recipeName, setRecipeName] = useState("");
  const [minIngredients, setMinIngredients] = useState();
  const [maxIngredients, setMaxIngredients] = useState();
  const [bookRecipeName, setBookRecipeName] = useState("");
  const [bookMinIngredients, setBookMinIngredients] = useState();
  const [bookMaxIngredients, setBookMaxIngredients] = useState();

  useEffect(() => {
    const storedIsLogged = localStorage.getItem("isLogged");
    const storedUserId = parseInt(localStorage.getItem("user_id"));
    if (storedIsLogged) {
      storedIsLogged === "true" ? setIsLogged(true) : setIsLogged(false);
    }
    if (storedUserId) {
      storedUserId === -1 ? setUserId(-1) : setUserId(storedUserId);
    }
    if (!isLogged && userId !== -1) {
      navigate("/login");
    } else {
      axios
        .get(`${import.meta.env.VITE_API_URL}/dashboard`, {
          params: { id: userId },
        })
        .then((response) => {
          setBookRecipes(response.data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [isLogged, navigate, userId, setIsLogged, setUserId]);

  function addRecipe(title, ingredientCount, url) {
    const credentials = {
      recipe_name: title,
      recipe_ingredients_amount: ingredientCount,
      recipe_url: url,
      user_id: userId,
    };
    if (
      !bookRecipes.some(
        (recipe) =>
          recipe.recipe_name === credentials.recipe_name &&
          recipe.recipe_ingredients_amount ===
            credentials.recipe_ingredients_amount &&
          recipe.recipe_url === credentials.recipe_url &&
          recipe.user_id === credentials.user_id
      )
    ) {
      axios
        .post(
          `${import.meta.env.VITE_API_URL}/dashboard/add?` +
            new URLSearchParams(credentials).toString(),
          credentials,
          []
        )
        .then((response) => {
          if (!bookRecipes) {
            setBookRecipes([credentials]);
          } else {
            setBookRecipes((prev) => {
              return [...prev, credentials];
            });
          }
          console.log(response);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  function deleteRecipe(title, ingredientCount, url) {
    const credentials = {
      recipe_name: title,
      recipe_ingredients_amount: ingredientCount,
      recipe_url: url,
      user_id: userId,
    };
    axios
      .delete(
        `${import.meta.env.VITE_API_URL}/dashboard/delete?` +
          new URLSearchParams(credentials).toString(),
        credentials,
        []
      )
      .then((response) => {
        console.log(response);
        setBookRecipes(
          bookRecipes.filter(
            (recipe) =>
              recipe.recipe_name != credentials.recipe_name &&
              recipe.recipe_ingredients_amount !=
                credentials.recipe_ingredients_amount &&
              recipe.recipe_url != credentials.recipe_url &&
              recipe.user_id == credentials.user_id
          )
        );
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function searchRecipe() {
    const query = {
      recipe_name: recipeName,
      min_ingredients: minIngredients,
      max_ingredients: maxIngredients,
      user_id: userId,
    };
    axios
      .get(
        `${import.meta.env.VITE_API_URL}/dashboard/recipes?` +
          new URLSearchParams(query).toString(),
        query,
        []
      )
      .then((response) => {
        setRecipes(response.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function searchBook() {
    const query = {
      book_recipe_name: bookRecipeName,
      book_min_ingredients: bookMinIngredients,
      book_max_ingredients: bookMaxIngredients,
      user_id: userId,
    };
    axios
      .get(
        `${import.meta.env.VITE_API_URL}/dashboard/search?` +
          new URLSearchParams(query).toString(),
        query,
        []
      )
      .then((response) => {
        setBookRecipes(response.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function buttonRedirect(event, url) {
    event.stopPropagation();
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function handleRecipeName(value) {
    setRecipeName(value);
  }

  function handleIngredientsMin(value) {
    setMinIngredients(value);
  }

  function handleIngredientsMax(value) {
    setMaxIngredients(value);
  }

  function handleBookRecipeName(value) {
    setBookRecipeName(value);
  }

  function handleBookIngredientsMin(value) {
    setBookMinIngredients(value);
  }

  function handleBookIngredientsMax(value) {
    setBookMaxIngredients(value);
  }

  return (
    <>
      <div className="DashboardHeaderContainer">
        <div>Find New Recipes</div>
        <div>Search Through Your Recipes</div>
      </div>
      <div className="DashboardContainer">
        <div className="DashboardSearch">
          <div className="RecipeSearchContainer">
            <Search
              header="Recipe Name"
              value={recipeName}
              placeholder="Name of Recipe..."
              name="recipeName"
              onChange={handleRecipeName}
            />
            <Search
              header="Ingredient Minimum"
              value={minIngredients}
              placeholder="Min"
              name="ingredientsMin"
              onChange={handleIngredientsMin}
              short={true}
            />
            <Search
              header="Ingredient Maximum"
              value={maxIngredients}
              placeholder="Max"
              name="ingredientsMax"
              onChange={handleIngredientsMax}
              short={true}
            />
            <button className="SearchButton" onClick={searchRecipe}>
              Search
            </button>
          </div>
          <div className="RecipeHolder">
            {recipes.map((recipe, index) => {
              return (
                <Recipe
                  key={index}
                  title={`${recipe.recipe_name}`}
                  url={`${recipe.recipe_url}`}
                  ingredientCount={parseInt(recipe.recipe_ingredients_amount)}
                  clickFunction={addRecipe}
                  buttonClickFunction={buttonRedirect}
                />
              );
            })}
          </div>
        </div>
        <div className="DashboardRecipes">
          <div className="RecipeSearchContainer">
            <Search
              header="Recipe Name"
              value={bookRecipeName}
              placeholder="Name of Recipe..."
              name="recipeName"
              onChange={handleBookRecipeName}
            />
            <Search
              header="Ingredient Minimum"
              value={bookMinIngredients}
              placeholder="Min"
              name="ingredientsMin"
              onChange={handleBookIngredientsMin}
              short={true}
            />
            <Search
              header="Ingredient Maximum"
              value={bookMaxIngredients}
              placeholder="Max"
              name="ingredientsMax"
              onChange={handleBookIngredientsMax}
              short={true}
            />
            <button className="SearchButton" onClick={searchBook}>
              Search
            </button>
          </div>
          <div className="BookHolder">
            {bookRecipes.map((recipe, index) => {
              return (
                <Recipe
                  key={index}
                  title={`${recipe.recipe_name}`}
                  url={`${recipe.recipe_url}`}
                  ingredientCount={parseInt(recipe.recipe_ingredients_amount)}
                  clickFunction={deleteRecipe}
                  buttonClickFunction={buttonRedirect}
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
