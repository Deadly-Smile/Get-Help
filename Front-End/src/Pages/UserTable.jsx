import { useDeleteUserMutation, useGetAllUsersQuery } from "../Store";
import { GoTrash } from "react-icons/go";
import ItemTable from "../Components/ItemTable";

const backEndURL = import.meta.env.VITE_BACKEND_URL;
const UserTable = () => {
  const [deleteUser, result] = useDeleteUserMutation();
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
              <div className="text-sm opacity-50">{user?.username}</div>
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
      title: "Is pending",
      render: (user) => {
        return user?.pending_subscriber ? "Pending" : "Not Pending";
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
      <p className="font-semibold text-center text-2xl pt-6">User List</p>
      <ItemTable config={config} query={useGetAllUsersQuery} result={result} />
    </div>
  );
};

export default UserTable;
