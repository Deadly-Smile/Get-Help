// import { FatchUsers } from "../Store";
// import { useDispatch, useSelector } from "react-redux";
import Table from "../Components/Table";
// import { useEffect } from "react";
import { useFetchUsersQuery } from "../Store";

const UsersTable = () => {
  const { data, error, isLoading } = useFetchUsersQuery();
  // const dispatch = useDispatch();
  // const { isPending, data, error } = useSelector((state) => {
  //   return state.users;
  // });

  // useEffect(() => {
  //   dispatch(FatchUsers());
  // }, [dispatch]);
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
