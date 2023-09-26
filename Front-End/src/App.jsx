import HomePage from "./Pages/HomePage";
import About from "./Pages/About";
import NotFound from "./Pages/NotFound";
import SignUp from "./Pages/SignUp";
import Login from "./Pages/Login";
import { Route, Routes } from "react-router-dom";
import Logout from "./Pages/Logout";
import { useGetUserQuery } from "./Store";
import EditProfile from "./Pages/EditProfile";
import AdminReg from "./Pages/AdminReg";
import UserTable from "./Pages/UserTable";
import DoctorTable from "./Pages/DoctorTable";
import AdminTable from "./Pages/AdminTable";
import PostTable from "./Pages/PostTable";
import CreatePostPage from "./Pages/CreatePostPage";
import ProfileViewPage from "./Pages/ProfileViewPage";
import PostPage from "./Pages/PostPage";
import UserContext from "./Context/UserContext";
import { Provider } from "./Context/MsgListContext";
import MessagePanelList from "./Components/MessagePanelList";
import NavConfig from "./Components/NavConfig";
import FooterConfig from "./Components/FooterConfig";

const App = () => {
  const { data, isSuccess } = useGetUserQuery();

  return (
    <div>
      <UserContext.Provider value={{ data, isSuccess }}>
        <Provider>
          <header className="fixed top-0 z-10 w-full">
            <NavConfig data={data} />
          </header>
          <section className="min-h-[calc(100vh-60px)] pt-16 mb-2 max-h-full">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<About />} />
              <Route
                path="/edit-profile"
                element={<EditProfile data={data} />}
              />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/apply-for-admin" element={<AdminReg />} />
              <Route path="/user-table" element={<UserTable />} />
              <Route path="/doctor-table" element={<DoctorTable />} />
              <Route path="/admin-table" element={<AdminTable />} />
              <Route path="/post-table" element={<PostTable />} />
              <Route path="/create-post" element={<CreatePostPage />} />
              <Route path="/get-user/:id" element={<ProfileViewPage />} />
              <Route path="/posts/:id" element={<PostPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <div className="fixed right-2 bottom-2">
              <MessagePanelList />
            </div>
          </section>
          <footer>
            <FooterConfig />
          </footer>
        </Provider>
      </UserContext.Provider>
    </div>
  );
};

export default App;
