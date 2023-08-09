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
import UserTable from "./Pages/UserTable";
import DoctorTable from "./Pages/DoctorTable";
import AdminTable from "./Pages/AdminTable";
import PostTable from "./Pages/PostTable";

const App = () => {
  const { data, isLoading, isError, isSuccess } = useGetUserQuery();
  const [activeNavLinks, setActiveNavLinks] = useState([
    { label: "About", link: "/about" },
    { label: "Log in", link: "/login" },
    { label: "Sign up", link: "/signup" },
  ]);
  const [activeFooterLinks, setActiveFooterLinks] = useState([
    { label: "Privacy Policy", link: "#" },
    { label: "Terms of Service", link: "#" },
    { label: "Contact", link: "#" },
    { label: "Buy me a cup of coffee", link: "#" },
  ]);

  useEffect(() => {
    let defaultNavLink = [
      { label: "About", link: "/about" },
      { label: "Log in", link: "/login" },
      { label: "Sign up", link: "/signup" },
    ];
    let defaultFooterLinks = [
      { label: "Privacy Policy", link: "#" },
      { label: "Terms of Service", link: "#" },
      { label: "Contact", link: "#" },
      { label: "Buy me a cup of coffee", link: "#" },
    ];

    if (isSuccess && data && data.user) {
      const navLinkWithPermission = [
        { label: "About", link: "/about" },
        { label: data.user.username, link: "/edit-profile" },
        { label: "Log out", link: "/logout" },
      ];
      const footerLinkWithPermission = [
        { label: "Privacy Policy", link: "#" },
        { label: "Terms of Service", link: "#" },
        { label: "Contact", link: "#" },
        { label: "Buy me a cup of coffee", link: "#" },
        { label: "Become an Admin", link: "/apply-for-admin" },
      ];

      if (data.permission.includes("edit-my-post")) {
        navLinkWithPermission.splice(2, 0, { label: "Posts", link: "#" });
      }

      if (data.permission.includes("edit-user-table")) {
        navLinkWithPermission.splice(1, 0, {
          label: "Users",
          link: "/user-table",
        });
      }

      if (data.permission.includes("edit-doctor-table")) {
        navLinkWithPermission.splice(1, 0, {
          label: "Doctors",
          link: "/doctor-table",
        });
      }

      if (data.permission.includes("edit-admin-table")) {
        navLinkWithPermission.splice(1, 0, {
          label: "Admins",
          link: "/admin-table",
        });
      }

      if (data.permission.includes("edit-post-table")) {
        footerLinkWithPermission.splice(1, 0, {
          label: "Post Table",
          link: "/post-table",
        });
      }

      setActiveNavLinks(navLinkWithPermission);
      setActiveFooterLinks(footerLinkWithPermission);
    } else {
      setActiveNavLinks(defaultNavLink);
      setActiveFooterLinks(defaultFooterLinks);
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
          <Route path="/user-table" element={<UserTable />} />
          <Route path="/doctor-table" element={<DoctorTable />} />
          <Route path="/admin-table" element={<AdminTable />} />
          <Route path="/post-table" element={<PostTable />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer linkList={activeFooterLinks} website="Get Help" />
    </div>
  );
};

export default App;
