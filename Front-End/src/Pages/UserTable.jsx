import { useGetAllUsersQuery } from "../Store";
import SortableTable from "../Components/SortableTable";
import { useEffect, useState } from "react";

const UserTable = () => {
  const { data, isLoading, isError, isSuccess } = useGetAllUsersQuery();
  const [users, setUsers] = useState([]);
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
      title: "email",
      render: (user) => {
        return user?.email;
      },
    },
    {
      title: "username",
      render: (user) => {
        return user?.username;
      },
      sortValue: (user) => user?.username,
    },
    {
      title: "avatar",
      render: (user) => {
        return user?.email;
      },
    },
    {
      title: "pending_subscriber",
      render: (user) => {
        return user?.pending_subscriber ? "true" : "false";
      },
    },
  ];
  const genarateKey = (user) => {
    return user?.id;
  };

  let render = null;
  if (isLoading) {
    render = <p className="text-blue-700 font-semibold">Loading...</p>;
  }
  if (isError) {
    render = <p className="text-red-800 font-semibold">Error occured!!</p>;
  }
  useEffect(() => {
    if (isSuccess) {
      setUsers(data?.users?.data);
    }
  }, [data, isSuccess]);
  return (
    <div>
      <SortableTable data={users} config={config} getKey={genarateKey} />
      <div>{render}</div>
    </div>
  );
};

export default UserTable;
