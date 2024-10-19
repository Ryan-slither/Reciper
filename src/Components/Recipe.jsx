import "./Recipe.css";
import PropTypes from "prop-types";

function Recipe(props) {
  return (
    <>
      <div
        className="RecipeContainer"
        onClick={() => {
          props.clickFunction(props.title, props.ingredientCount, props.url);
        }}
      >
        <div className="RecipeTitle">{props.title}</div>
        <div className="RecipeIngredients">
          # of Ingredients: {props.ingredientCount}
        </div>
        <button
          className="RecipeButton"
          onClick={(event) => {
            props.buttonClickFunction(event, props.url);
          }}
        >
          <div className="RecipeUrl">{props.url}</div>
          <img className="RecipeImage" src="NewPage.png" />
        </button>
      </div>
    </>
  );
}

Recipe.propTypes = {
  title: PropTypes.string.isRequired,
  ingredientCount: PropTypes.number.isRequired,
  url: PropTypes.string.isRequired,
  clickFunction: PropTypes.func.isRequired,
  buttonClickFunction: PropTypes.func.isRequired,
};

export default Recipe;
