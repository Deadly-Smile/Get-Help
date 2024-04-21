import { GoTrash } from "react-icons/go";
import ItemTable from "../Components/ItemTable";
import classNames from "classnames";
import DownloadLink from "../Components/DownloadLink";
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
  const [approveDoctor, approveDoctorResult] = useApproveDoctorMutation();
  const [disproveDoctor, disproveDoctorResult] = useDisproveDoctorMutation();

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
          <label className={labelClassnames}>ID</label>
          <input
            type="number"
            value={user?.id ? user.id : ""}
            disabled="disabled"
            className={inputClassnames}
          />
        </div>
        <div className="flex mb-4">
          <label className={labelClassnames}>Name</label>
          <input
            type="text"
            value={user?.name ? user?.name : ""}
            disabled="disabled"
            className={inputClassnames}
          />
        </div>
        <div className="flex mb-4">
          <label className={labelClassnames}>E-mail</label>
          <input
            type="email"
            value={user?.email ? user?.email : ""}
            disabled="disabled"
            className={inputClassnames}
          />
        </div>
        <div className="flex mb-4">
          <label className={labelClassnames}>Username</label>
          <input
            type="text"
            value={user?.username ? user?.username : ""}
            disabled="disabled"
            className={inputClassnames}
          />
        </div>
        <div className="flex mb-4">
          <label className={labelClassnames}>Mobile</label>
          <input
            type="text"
            value={user?.mobile ? user?.mobile : ""}
            disabled="disabled"
            className={inputClassnames}
          />
        </div>
        <div className="flex mb-4">
          <label className={labelClassnames}>NID Card</label>
          <input
            type="text"
            value={user?.nid_card_number ? user?.nid_card_number : ""}
            disabled="disabled"
            className={inputClassnames}
          />
        </div>
        <div className="flex mb-4">
          <label className={labelClassnames}>Country</label>
          <input
            type="text"
            value={user?.country ? user?.country : ""}
            disabled="disabled"
            className={inputClassnames}
          />
        </div>
        <div className="flex mb-4">
          <label className={labelClassnames}>District</label>
          <input
            type="text"
            value={user?.district ? user?.district : ""}
            disabled="disabled"
            className={inputClassnames}
          />
        </div>
        <div className="flex mb-4">
          <label className={labelClassnames}>Address</label>
          <input
            type="text"
            value={user?.address ? user?.address : ""}
            disabled="disabled"
            className={inputClassnames}
          />
        </div>
        <div className="flex mb-4">
          <label className={labelClassnames}>Date of Birth</label>
          <input
            type="text"
            value={user?.date_of_birth ? user?.date_of_birth : ""}
            disabled="disabled"
            className={inputClassnames}
          />
        </div>
        <div className="flex mb-4">
          <label className={labelClassnames}>Pending Subscriber</label>
          <input
            type="text"
            value={user?.pending_subscriber ? "Pending" : "Not Pending"}
            disabled="disabled"
            className={inputClassnames}
          />
        </div>
        <div className="flex mb-4">
          <label className={labelClassnames}>Pending Doctor</label>
          <input
            type="text"
            value={user?.pending_doctor ? "Pending" : "Not Pending"}
            disabled="disabled"
            className={inputClassnames}
          />
        </div>
        <div className="flex mb-4">
          <label className={labelClassnames}>Pending Admin</label>
          <input
            type="text"
            value={user?.pending_admin ? "Pending" : "Not Pending"}
            disabled="disabled"
            className={inputClassnames}
          />
        </div>
        <div className="flex mb-4">
          <label className={labelClassnames}>Document</label>
          <DownloadLink
            fileUrl={`${backEndURL}${user?.document}`}
            fileName="document.pdf"
          />
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
        return (
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="mask mask-squircle w-12 h-12">
                <img
                  src={
                    user?.avatar
                      ? `${backEndURL}${user?.avatar}`
                      : "https://cdn.onlinewebfonts.com/svg/img_329115.png"
                  }
                  alt={`${user?.username}'s Avatar`}
                />
              </div>
            </div>
            <div>
              <div className="font-bold">{user?.name}</div>
              <div className="text-sm opacity-50">
                <Link to={`/home/get-user/${user?.id}`}>
                  <span className=" hover:text-green-800 hover:underline">
                    {user?.username}
                  </span>
                </Link>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: "E-mail",
      render: (user) => {
        return user?.email;
      },
    },
    {
      title: "Details",
      render: (user) => {
        return (
          <>
            <button
              className="btn"
              onClick={() => document.getElementById("my_modal_5").showModal()}
            >
              Show details
            </button>
            <dialog id="my_modal_5" className="modal">
              <div className="modal-box w-5/6 max-w-5xl">
                {renderMore(user)}
              </div>
              <form method="dialog" className="modal-backdrop">
                <button>close</button>
              </form>
            </dialog>
          </>
        );
      },
    },
    {
      title: "Approve/Disprove",
      render: (user) => {
        const id = user?.id;
        return user?.pending_doctor ? (
          <button
            onClick={() => {
              approveDoctor({ id });
            }}
            className="btn btn-success"
          >
            Approve
          </button>
        ) : (
          <button
            onClick={() => {
              disproveDoctor({ id });
            }}
            className="btn btn-error"
          >
            Remove
          </button>
        );
      },
    },
    {
      title: "Delete User",
      render: (user) => {
        const id = user.id;
        return (
          <button
            className="p-3 mx-5 hover:bg-red-500 items-center rounded-md"
            onClick={() => {
              deleteUser({ id });
            }}
          >
            <GoTrash />
          </button>
        );
      },
    },
  ];

  return (
    <div>
      <p className="text-center font-bold text-2xl pt-6">Doctor List</p>
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
            ? "Successfully added the user as a doctor"
            : null}
        </p>
        <p>
          {disproveDoctorResult.isSuccess
            ? "Successfully remove the user as a doctor"
            : null}
        </p>
        <p>
          {disproveDoctorResult.isError
            ? "Error occured removing the user as a doctor"
            : null}
        </p>
      </div>
    </div>
  );
};

export default DoctorTable;
