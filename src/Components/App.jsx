import Homepage from "./Homepage.jsx";
import Nav from "./Nav.jsx";
import Footer from "./Footer.jsx";
import Login from "./Login.jsx";
import Dashboard from "./Dashboard.jsx";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { useState } from "react";
import Signup from "./Signup.jsx";
import loggedInContext from "./loggedInContext.jsx";
import userIdContext from "./userIdContext.jsx";

function Layout() {
  return (
    <>
      <Nav />
      <Outlet />
      <Footer />
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Homepage />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
    ],
  },
]);

function App() {
  const [isLogged, setIsLogged] = useState(false);
  const [userId, setUserId] = useState(-1);

  return (
    <>
      <userIdContext.Provider value={{ userId, setUserId }}>
        <loggedInContext.Provider value={{ isLogged, setIsLogged }}>
          <RouterProvider router={router} />
        </loggedInContext.Provider>
      </userIdContext.Provider>
    </>
  );
}

export default App;
