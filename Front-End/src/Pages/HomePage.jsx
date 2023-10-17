import ContactPanel from "../Components/ContactsPanel";
import UserSearchPanel from "../Components/UserSearchPanel";
import { Outlet } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="flex ">
      <div className="w-1/12 flex-none"></div>
      <div className="grow">
        <div className="flex justify-center items-center max-w-[1000px] overflow-x-auto">
          <Outlet />
        </div>
      </div>
      <div className="flex-none w-2/12 p-1 border-l-4 max-h-[500px] overflow-y-auto">
        <UserSearchPanel />
        <ContactPanel />
      </div>
    </div>
  );
};

export default HomePage;
