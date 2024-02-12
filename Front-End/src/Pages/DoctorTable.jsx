import { useState } from "react";
import { GoTrash } from "react-icons/go";
import ItemTable from "../Components/ItemTable";
import Button from "../Components/Button";
import classNames from "classnames";
import DownloadLink from "../Components/DownloadLink";
import PopUpPanel from "../Components/PopUpPanel";
import { Link } from "react-router-dom";
import {
  useApproveDoctorMutation,
  useDeleteUserMutation,
  useDisproveDoctorMutation,
  useGetAllDoctorsQuery,
} from "../Store";

const backEndURL = import.meta.env.VITE_BACKEND_URL;
const DoctorTable = () => {
  const [deleteUser, deleteUserResult] = useDeleteUserMutation();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [approveDoctor, approveDoctorResult] = useApproveDoctorMutation();
  const [disproveDoctor, disproveDoctorResult] = useDisproveDoctorMutation();

  const openPanel = () => {
    setIsPanelOpen(true);
  };

  const closePanel = () => {
    // event?.preventDefault();
    setIsPanelOpen(false);
  };

  const labelClassnames = classNames(
    "text-sm font-bold mr-2 w-1/4 flex items-center justify-start"
  );
  const inputClassnames = classNames(
    "w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
  );

  const renderMore = (user) => {
    return (
      <form>
        <div className="flex mb-4">
          <label className={labelClassnames}>ID :</label>
          <input
            type="number"
            value={user?.id ? user.id : ""}
            disabled="disabled"
            className={inputClassnames}
          />
        </div>
        <div className="flex mb-4">
          <label className={labelClassnames}>Name :</label>
          <input
            type="text"
            value={user?.name ? user?.name : ""}
            disabled="disabled"
            className={inputClassnames}
          />
        </div>
        <div className="flex mb-4">
          <label className={labelClassnames}>E-mail :</label>
          <input
            type="email"
            value={user?.email ? user?.email : ""}
            disabled="disabled"
            className={inputClassnames}
          />
        </div>
        <div className="flex mb-4">
          <label className={labelClassnames}>Username :</label>
          <input
            type="text"
            value={user?.username ? user?.username : ""}
            disabled="disabled"
            className={inputClassnames}
          />
        </div>
        <div className="flex mb-4">
          <label className={labelClassnames}>Mobile :</label>
          <input
            type="text"
            value={user?.mobile ? user?.mobile : ""}
            disabled="disabled"
            className={inputClassnames}
          />
        </div>
        <div className="flex mb-4">
          <label className={labelClassnames}>NID Card :</label>
          <input
            type="text"
            value={user?.nid_card_number ? user?.nid_card_number : ""}
            disabled="disabled"
            className={inputClassnames}
          />
        </div>
        <div className="flex mb-4">
          <label className={labelClassnames}>Country :</label>
          <input
            type="text"
            value={user?.country ? user?.country : ""}
            disabled="disabled"
            className={inputClassnames}
          />
        </div>
        <div className="flex mb-4">
          <label className={labelClassnames}>District :</label>
          <input
            type="text"
            value={user?.district ? user?.district : ""}
            disabled="disabled"
            className={inputClassnames}
          />
        </div>
        <div className="flex mb-4">
          <label className={labelClassnames}>Address :</label>
          <input
            type="text"
            value={user?.address ? user?.address : ""}
            disabled="disabled"
            className={inputClassnames}
          />
        </div>
        <div className="flex mb-4">
          <label className={labelClassnames}>Date of Birth :</label>
          <input
            type="text"
            value={user?.date_of_birth ? user?.date_of_birth : ""}
            disabled="disabled"
            className={inputClassnames}
          />
        </div>
        <div className="flex mb-4">
          <label className={labelClassnames}>Pending Subscriber :</label>
          <input
            type="text"
            value={user?.pending_subscriber ? "Pending" : "Not Pending"}
            disabled="disabled"
            className={inputClassnames}
          />
        </div>
        <div className="flex mb-4">
          <label className={labelClassnames}>Pending Doctor :</label>
          <input
            type="text"
            value={user?.pending_doctor ? "Pending" : "Not Pending"}
            disabled="disabled"
            className={inputClassnames}
          />
        </div>
        <div className="flex mb-4">
          <label className={labelClassnames}>Pending Admin :</label>
          <input
            type="text"
            value={user?.pending_admin ? "Pending" : "Not Pending"}
            disabled="disabled"
            className={inputClassnames}
          />
        </div>
        <div className="flex mb-4">
          <label className={labelClassnames}>Document :</label>
          <DownloadLink
            fileUrl={`${backEndURL}${user?.document}`}
            fileName="document.pdf"
          />
        </div>
        <div className="mt-4 flex justify-end">
          <Button
            onClick={(event) => {
              event.preventDefault();
              setIsPanelOpen(!isPanelOpen);
            }}
            secondary
            rounded
            className="text-white mr-2 px-4 py-2 rounded-md focus:outline-none focus:bg-white focus:text-gray-800 hover:text-gray-800 hover:bg-white"
          >
            Close
          </Button>
        </div>
      </form>
    );
  };

  const config = [
    {
      title: "ID.",
      render: (user) => {
        return user?.id;
      },
      sortValue: (user) => user?.id,
    },
    {
      title: "Name",
      render: (user) => {
        return user?.name;
      },
    },
    {
      title: "E-mail",
      render: (user) => {
        return user?.email;
      },
    },
    {
      title: "Username",
      render: (user) => {
        return (
          <Link to={`/home/get-user/${user?.id}`}>
            <h1 className="font-semibold text-2xl ml-2 text-blue-600 hover:text-green-800 hover:underline">
              {user?.username}
            </h1>
          </Link>
        );
      },
      sortValue: (user) => user?.username,
    },
    {
      title: "Avatar",
      render: (user) => {
        return (
          <img
            src={`${backEndURL}${user?.avatar}`}
            alt="User Avatar"
            className="rounded-3xl max-w-[40px] max-h-[40px]"
          />
        );
      },
    },
    {
      title: "More Info",
      render: (user) => {
        return (
          <div>
            <Button secondary className="rounded text-xs" onClick={openPanel}>
              See More
            </Button>
            <PopUpPanel isOpen={isPanelOpen} onClose={closePanel}>
              <h2 className="flex justify-center font-semibold text-lg my-2">
                {user?.username}
              </h2>
              {renderMore(user)}
            </PopUpPanel>
          </div>
        );
      },
    },
    {
      title: "Approve/Disprove",
      render: (user) => {
        const id = user?.id;
        return user?.pending_doctor ? (
          <Button
            onClick={() => {
              approveDoctor({ id });
            }}
            secondary
            rounded
            className="text-white mr-2 px-4 py-2 rounded-md focus:outline-none focus:bg-white focus:text-gray-800 hover:text-gray-800 hover:bg-white"
          >
            Approve
          </Button>
        ) : (
          <Button
            onClick={() => {
              disproveDoctor({ id });
            }}
            secondary
            rounded
            className="text-white mr-2 py-2 rounded-md focus:outline-none focus:bg-white focus:text-gray-800 hover:text-gray-800 hover:bg-white"
          >
            Remove as Doctor
          </Button>
        );
      },
    },
    {
      title: "Delete User",
      render: (user) => {
        const id = user.id;
        return (
          <Button
            className="px-4 mx-5"
            onClick={() => {
              deleteUser({ id });
            }}
          >
            <GoTrash />
          </Button>
        );
      },
    },
  ];
  return (
    <div>
      <p className="font-semibold text-center text-2xl">Doctor List</p>

      <ItemTable
        config={config}
        query={useGetAllDoctorsQuery}
        result={deleteUserResult}
      />
      <div>
        <p>
          {approveDoctorResult.isError
            ? "Error occured approving the user"
            : null}
        </p>
        <p>
          {approveDoctorResult.isSuccess
            ? "Successfully added the user as admin"
            : null}
        </p>
        <p>
          {disproveDoctorResult.isSuccess
            ? "Successfully remove the user as admin"
            : null}
        </p>
        <p>
          {disproveDoctorResult.isError
            ? "Error occured removing the user as admin"
            : null}
        </p>
      </div>
    </div>
  );
};

export default DoctorTable;
