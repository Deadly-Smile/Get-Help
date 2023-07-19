import Table from "../Components/Table";
import { useFetchUsersQuery } from "../Store";

const UsersTable = () => {
  const { data, error, isLoading } = useFetchUsersQuery();
  const config = [
    {
      title: "Id",
      render: (user) => {
        return user.id;
      },
    },
    {
      title: "Username",
      render: (user) => {
        return user.username;
      },
    },
    {
      title: "Name",
      render: (user) => {
        return user.name;
      },
    },
    {
      title: "E-mail",
      render: (user) => {
        return user.email;
      },
    },
  ];
  const getKey = (user) => {
    return user.id;
  };

  let render = null;
  if (isLoading) {
    render = <div>Loading....</div>;
  }
  if (error) {
    render = <div>{error.message}</div>;
  }
  if (data && !error && !isLoading) {
    render = <Table data={data} config={config} getKey={getKey} />;
  }

  return <div>{render}</div>;
};

export default UsersTable;
