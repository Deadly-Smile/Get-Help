import HomePage from "./Pages/HomePage";
import About from "./Pages/About";
import NotFound from "./Pages/NotFound";
import SignUp from "./Pages/SignUp";
import Login from "./Pages/Login";
import { Route, Routes } from "react-router-dom";
import Logout from "./Pages/Logout";
import { useGetUserQuery } from "./Store";
import UserContext from "./Context/UserContext";
import { Provider } from "./Context/MsgListContext";
import MessagePanelList from "./Components/MessagePanelList";
import NavConfig from "./Components/NavConfig";
import LoadingContext from "./Context/LoadingContext";
import LoadingBar from "react-top-loading-bar";
import { useState, useEffect } from "react";
import { useGetPostsQuery, useVotePostMutation } from "./Store";
import PostList from "./Components/PostList";
import AdminReg from "./Pages/AdminReg";
import UserTable from "./Pages/UserTable";
import DoctorTable from "./Pages/DoctorTable";
import AdminTable from "./Pages/AdminTable";
import PostTable from "./Pages/PostTable";
import CreatePostPage from "./Pages/CreatePostPage";
import ProfileViewPage from "./Pages/ProfileViewPage";
import PostPage from "./Pages/PostPage";
import RechargeTokenTable from "./Pages/RechargeTokenTable";
import EditProfile from "./Pages/EditProfile";
import IntroPage from "./Pages/IntroPage";
import SignUpVerification from "./Components/SignUpVerification";
import Footer from "./Components/Footer";

const App = () => {
  const { data, isSuccess, isLoading } = useGetUserQuery();
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (isLoading) {
      setProgress(30);
    } else {
      setProgress(100);
    }
  }, [isLoading]);

  return (
    <LoadingContext.Provider value={{ progress, setProgress }}>
      <UserContext.Provider value={{ data, isSuccess }}>
        <Provider>
          <header>
            <LoadingBar
              color="#f11946"
              progress={progress}
              onLoaderFinished={() => setProgress(0)}
            />
            <NavConfig data={data} />
          </header>
          <section>
            <Routes>
              <Route path="/" element={<IntroPage />} />
              <Route
                path="/home"
                element={<HomePage isSuccess={data != null} />}
              >
                <Route
                  index
                  element={
                    <PostList
                      query={useGetPostsQuery}
                      mutation={useVotePostMutation}
                    />
                  }
                />
                <Route path="apply-for-admin" element={<AdminReg />} />
                <Route path="user-table" element={<UserTable />} />
                <Route path="doctor-table" element={<DoctorTable />} />
                <Route path="admin-table" element={<AdminTable />} />
                <Route path="post-table" element={<PostTable />} />
                <Route path="create-post" element={<CreatePostPage />} />
                <Route path="get-user/:id" element={<ProfileViewPage />} />
                <Route path="posts/:id" element={<PostPage />} />
                <Route path="token-table" element={<RechargeTokenTable />} />
                <Route
                  path="edit-profile"
                  element={<EditProfile data={data} />}
                />
                <Route path="*" element={<NotFound />} />
              </Route>
              <Route path="/about" element={<About />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/get-user/:id" element={<ProfileViewPage />} />
              <Route
                path="/verify-user/:id"
                element={<SignUpVerification message="Submit the code" />}
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <div className="fixed right-2 bottom-2">
              <MessagePanelList />
            </div>
          </section>
          <footer>
            <Footer />
          </footer>
        </Provider>
      </UserContext.Provider>
    </LoadingContext.Provider>
  );
};

export default App;
