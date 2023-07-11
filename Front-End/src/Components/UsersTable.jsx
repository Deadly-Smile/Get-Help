import { FatchUsers } from "../Store";
import { useDispatch, useSelector } from "react-redux";
import Table from "../Components/Table";
import { useEffect } from "react";

const UsersTable = () => {
  const dispatch = useDispatch();
  const { isPending, data, error } = useSelector((state) => {
    return state.users;
  });

  useEffect(() => {
    dispatch(FatchUsers());
  }, [dispatch]);
  const config = [
    {
      title: "Id",
      render: (user) => {
        return user.id;
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
  if (isPending) {
    render = <div>Loading....</div>;
  }
  if (error) {
    render = <div>{error.message}</div>;
  }
  if (data.length) {
    render = <Table data={data} config={config} getKey={getKey} />;
  }
  return <div>{render}</div>;
};

export default UsersTable;
