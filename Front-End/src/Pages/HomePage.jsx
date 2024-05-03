import ContactPanel from "../Components/ContactsPanel";
import UserSearchPanel from "../Components/UserSearchPanel";
import { Outlet } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const HomePage = ({ isSuccess }) => {
  return (
    <div className="flex flex-col w-full lg:flex-row">
      <div className="w-2/12 bg-base-50"></div>
      <div className="w-10/12 bg-base-200 place-items-center px-4 rounded-md">
        <Outlet />
      </div>
      {/* <div className="divider divider-warning lg:divider-horizontal"></div> */}
      <div className="bg-base-50 place-items-center">
        <UserSearchPanel />
        {isSuccess && <ContactPanel />}
      </div>
    </div>
    // <div className="flex ">
    //   <div className="w-1/12 flex-none"></div>
    //   <div className="grow">
    //     <div className="flex justify-center items-center max-w-[1000px] overflow-x-auto">
    //       <Outlet />
    //     </div>
    //   </div>
    //   <div className="flex-none w-2/12 p-1 border-l-4 max-h-[500px] overflow-y-auto">
    //     <UserSearchPanel />
    //     <ContactPanel />
    //   </div>
    // </div>
  );
};

export default HomePage;
