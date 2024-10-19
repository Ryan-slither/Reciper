import axios from "axios";
import "./Signup.css";
import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Field from "./Field";
import loggedInContext from "./loggedInContext";
import userIdContext from "./userIdContext";

function Signup() {
  const navigate = useNavigate();
  const [isError, setIsError] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const { isLogged, setIsLogged } = useContext(loggedInContext);
  // eslint-disable-next-line no-unused-vars
  const { _userId, setUserId } = useContext(userIdContext);

  useEffect(() => {
    const storedIsLogged = localStorage.getItem("isLogged");
    const storedUserId = parseInt(localStorage.getItem("user_id"));
    if (storedIsLogged) {
      console.log(storedIsLogged);
      console.log(storedIsLogged === "true");
      storedIsLogged === "true" ? setIsLogged(true) : setIsLogged(false);
    }
    if (storedUserId) {
      console.log(storedUserId);
      storedUserId === -1 ? setUserId(-1) : setUserId(storedUserId);
    }
  });

  const handleEmailChange = (value) => {
    setEmail(value);
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
  };

  const handleFirstNameChange = (value) => {
    setFirstName(value);
  };

  const submitCredentials = () => {
    const credentials = {
      email: email,
      password: password,
      firstName: firstName,
    };
    axios
      .post(
        `${
          import.meta.env.VITE_API_URL
        }/signup?firstName=${firstName}&email=${email}&password=${password}`,
        credentials,
        []
      )
      .then((response) => {
        if (!response.data.errors) {
          console.log("Sign Up", response);
          setEmail("");
          setPassword("");
          setFirstName("");
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
      <div className="SignupContainer">
        <div className="SignupAccount">
          {`Already have an account?`}{" "}
          <Link to={isLogged ? "/dashboard" : "/login"}>Log In</Link>
        </div>
        <div className="SignupError">
          {isError &&
            `**An input field is incorrect or email already exists (No empty fields, email must be an email, password 8 characters long, max 20 characters in fields)**`}
        </div>
        <Field
          header="First Name"
          placeholder="Enter your first name..."
          onChange={handleFirstNameChange}
          value={firstName}
          name="firstName"
        />
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
        <div className="SignupButtonContainer">
          <button className="SignupButton" onClick={submitCredentials}>
            Sign Up
          </button>
        </div>
      </div>
    </>
  );
}

export default Signup;
