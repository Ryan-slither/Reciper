import axios from "axios";
import "./Login.css";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Field from "./Field";
import loggedInContext from "./loggedInContext";
import userIdContext from "./userIdContext";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const { _isLogged, setIsLogged } = useContext(loggedInContext);
  // eslint-disable-next-line no-unused-vars
  const { _userId, setUserId } = useContext(userIdContext);

  const handleEmailChange = (value) => {
    setEmail(value);
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
  };

  const submitCredentials = () => {
    const credentials = { email: email, password: password };
    axios
      .post(
        `${
          import.meta.env.VITE_API_URL
        }/login?email=${email}&password=${password}`,
        credentials,
        []
      )
      .then((response) => {
        if (!response.data.errors) {
          console.log(response);
          setEmail("");
          setPassword("");
          setIsLogged(true);
          setUserId(response.data.id);
          navigate("/dashboard");
          localStorage.setItem("isLogged", "true");
          localStorage.setItem("user_id", String(response.data.id));
        } else {
          setIsError(true);
          console.log(response.data.errors);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      <div className="LoginContainer">
        <div className="LoginNoAccount">
          {`Don't have an account?`} <Link to="/signup">Sign Up</Link>
        </div>
        <div className="LoginError">
          {isError && `**Account not found or password is incorrect**`}
        </div>
        <Field
          header="Email"
          placeholder="Enter your email..."
          onChange={handleEmailChange}
          value={email}
          name="email"
        />
        <Field
          header="Password"
          placeholder="Enter your password..."
          onChange={handlePasswordChange}
          value={password}
          name="password"
        />
        <div className="LoginButtonContainer">
          <button className="LoginButton" onClick={submitCredentials}>
            Log In
          </button>
        </div>
      </div>
    </>
  );
}

export default Login;
