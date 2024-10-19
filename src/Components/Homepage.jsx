import "./Homepage.css";
import Recipe from "./Recipe";

function Homepage() {
  return (
    <>
      <div className="Homepage">
        <div className="HomepageText">
          <div className="HomepageTitle">Reciper</div>
          <div className="HomepageInfo">
            A place where you can find and store your favorite recipes
          </div>
        </div>
        <div className="HomepageRecipes">
          <Recipe
            title="Mac n' 'Cheese'"
            url="https://food52.com/recipes/35125-mac-n-cheese"
            ingredientCount={9}
            clickFunction={() => {
              console.log("I am Home");
            }}
          />
          <Recipe
            title="Mac n' 'Cheese'"
            url="https://food52.com/recipes/35125-mac-n-cheese"
            ingredientCount={9}
            clickFunction={() => {
              console.log("I am Home");
            }}
          />
        </div>
      </div>
    </>
  );
}

export default Homepage;
