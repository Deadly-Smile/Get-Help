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
import EditProfile from "./Pages/EditProfile";
import Footer from "./Components/Footer";
import AdminReg from "./Pages/AdminReg";

const App = () => {
  const { data, isLoading, isError, isSuccess } = useGetUserQuery();
  const [activeNavLinks, setActiveNavLinks] = useState([
    { label: "About", link: "/about" },
    { label: "Log in", link: "/login" },
    { label: "Sign up", link: "/signup" },
  ]);

  useEffect(() => {
    if (isSuccess) {
      if (data) {
        if (data.username) {
          setActiveNavLinks([
            { label: "About", link: "/about" },
            { label: data.username, link: "/edit-profile" },
            { label: "Log out", link: "/logout" },
          ]);
        }
      }
    } else {
      setActiveNavLinks([
        { label: "About", link: "/about" },
        { label: "Log in", link: "/login" },
        { label: "Sign up", link: "/signup" },
      ]);
    }
  }, [data, isSuccess]);

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
              <HomePage
                data={data}
                isLoading={isLoading}
                isError={isError}
                isSuccess={isSuccess}
              />
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="//edit-profile" element={<EditProfile data={data} />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/apply-for-admin" element={<AdminReg />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
