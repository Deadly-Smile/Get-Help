import HomePage from "./Pages/HomePage";
import About from "./Pages/About";
import NotFound from "./Pages/NotFound";
import SignUp from "./Pages/SignUp";
import Login from "./Pages/Login";
import { Route, Routes } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Logout from "./Pages/Logout";
import { useGetUserQuery } from "./Store";
import { useEffect, useState } from "react";

const App = () => {
  const { data, isLoading, isError, refetch } = useGetUserQuery();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [usernameLabel, setUsernameLabel] = useState("username");

  const [activeNavLinks, setActiveNavLinks] = useState([
    { label: "About", link: "/about" },
    { label: "Log in", link: "/login" },
    { label: "Sign up", link: "/signup" },
  ]);

  useEffect(() => {
    if (isLoggedIn) {
      setActiveNavLinks([
        { label: "About", link: "/about" },
        { label: usernameLabel, link: "/" },
        { label: "Log out", link: "/logout" },
      ]);
    } else {
      setActiveNavLinks([
        { label: "About", link: "/about" },
        { label: "Log in", link: "/login" },
        { label: "Sign up", link: "/signup" },
      ]);
    }
  }, [isLoggedIn, usernameLabel]);

  useEffect(() => {
    refetch().then((result) => {
      if (result.data) {
        if (result.data.username) {
          setUsernameLabel(result.data.username);
          handleLogin();
        }
      }
    });
  }, [refetch]);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const attempLogin = () => {
    refetch();
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const logoutFrontPart = () => {
    attempLogin();
    handleLogout();
  };

  return (
    <div>
      <header className="sticky top-0 z-10">
        <Navbar linkList={activeNavLinks} />
      </header>
      <div>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage data={data} isLoading={isLoading} isError={isError} />
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login attempLogin={attempLogin} />} />
          <Route
            path="/logout"
            element={<Logout logoutFrontPart={logoutFrontPart} />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
