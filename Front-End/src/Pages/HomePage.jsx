import ContactPanel from "../Components/ContactsPanel";
import UserSearchPanel from "../Components/UserSearchPanel";
import { Outlet } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="flex flex-col relative">
      <div className="flex-grow flex">
        <div className="flex justify-center items-center w-9/12 ml-20">
          <Outlet />
        </div>

        <div className="w-2/12 p-1 border-l-4 min-h-full">
          <UserSearchPanel />
          <ContactPanel />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
