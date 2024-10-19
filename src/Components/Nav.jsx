import { Link, useLocation } from "react-router-dom";
import "./Nav.css";
import { useContext } from "react";
import loggedInContext from "./loggedInContext";
import userIdContext from "./userIdContext";
import { useEffect } from "react";

function Nav() {
  const location = useLocation();
  const { isLogged, setIsLogged } = useContext(loggedInContext);
  // eslint-disable-next-line no-unused-vars
  const { _userId, setUserId } = useContext(userIdContext);

  useEffect(() => {
    const storedIsLogged = localStorage.getItem("isLogged");
    const storedUserId = parseInt(localStorage.getItem("user_id"));
    if (storedIsLogged) {
      storedIsLogged === "true" ? setIsLogged(true) : setIsLogged(false);
    }
    if (storedUserId) {
      storedUserId === -1 ? setUserId(-1) : setUserId(storedUserId);
    }
  });

  return (
    <>
      <div className="Nav">
        <Link className="NavImgLink" to="/">
          <img className="NavImg" src="reciper_icon.svg" alt="Reciper Icon" />
        </Link>
        {location.pathname !== "/" || (
          <div className="NavButtonContainer">
            <Link to="signup">
              <button className="NavButton">Sign Up</button>
            </Link>
            <Link to={isLogged ? "/dashboard" : "/login"}>
              <button className="NavButton">Log In</button>
            </Link>
          </div>
        )}
        {location.pathname === "/dashboard" && (
          <div className="NavButtonContainer">
            <Link to="/">
              <button
                className="NavButton"
                onClick={() => {
                  setIsLogged(false);
                  localStorage.setItem("isLogged", "false");
                  localStorage.setItem("user_id", "-1");
                }}
              >
                Log Out
              </button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

export default Nav;
