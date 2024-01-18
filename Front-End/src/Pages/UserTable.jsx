import { useDeleteUserMutation, useGetAllUsersQuery } from "../Store";
import { GoTrash } from "react-icons/go";
import ItemTable from "../Components/ItemTable";
import Button from "../Components/Button";

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
        return user?.username;
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
            className="max-w-xs max-h-48"
          />
        );
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
      <p className="font-semibold text-center text-2xl">User List</p>
      <ItemTable config={config} query={useGetAllUsersQuery} result={result} />
    </div>
  );
};

export default UserTable;
