import {
  useAssignTokenToAdminMutation,
  useCreateRechargeTokenMutation,
  useDeleteRechargeTokenMutation,
  useGetRechargeTokensQuery,
} from "../Store";
import Button from "../Components/Button";
import { GoTrash } from "react-icons/go";
import ItemTable from "../Components/ItemTable";
import { useContext, useState, useEffect } from "react";
import UserContext from "../Context/UserContext";
import classNames from "classnames";
import PopUpPanel from "../Components/PopUpPanel";
import ToastMessage from "../Components/ToastMessage";

const RechargeTokenTable = () => {
  const [deleteRechargeToken, deleteResult] = useDeleteRechargeTokenMutation();
  const [createRechargeToken] = useCreateRechargeTokenMutation();
  const [assignTokenToAdmin, assignResult] = useAssignTokenToAdminMutation();
  const [showToast, setShowToast] = useState(false);
  const [formData, setFormData] = useState({
    value: 0,
    handler: "",
  });

  const { data } = useContext(UserContext);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const labelClassnames = classNames(
    "text-sm font-bold mr-2 w-1/4 flex items-center justify-start"
  );
  const inputClassnames = classNames(
    "w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
  );

  const [newHandler, setNewHandler] = useState("");
  const [editableTokenId, setEditableTokenId] = useState(null);
  const config = [
    {
      title: "ID.",
      render: (token) => {
        return token?.id;
      },
      sortValue: (token) => token?.id,
    },
    {
      title: "Creator",
      render: (token) => {
        return token?.creator;
      },
    },
    {
      title: "Handler",
      render: (token) => {
        return (
          <div>
            {editableTokenId === token.id ? (
              <input
                type="text"
                value={newHandler}
                onChange={(e) => setNewHandler(e.target.value)}
                onBlur={() => {
                  // Update the handler for the specific token
                  // setIsEditable(false);
                  assignTokenToAdmin({ id: token.id, adminName: newHandler });
                  setEditableTokenId(null);
                  // Update the handler for the token using the newHandler value
                  // You'll need to implement the logic to update the handler
                }}
              />
            ) : (
              <p
                onDoubleClick={() => {
                  setEditableTokenId(token.id);
                  setNewHandler(token.handler);
                }}
              >
                {token?.handler ? token?.handler : "None"}
              </p>
            )}
          </div>
        );
      },
    },
    {
      title: "Token",
      render: (token) => {
        return token?.token;
      },
    },
    {
      title: "Value",
      render: (token) => {
        return token?.value;
      },
    },
    {
      title: "Is Used",
      render: (token) => {
        return token?.is_used ? "Yes" : "No";
      },
    },
    {
      title: "Used User",
      render: (token) => {
        return token?.used_user ? token?.used_user : "None";
      },
    },
    {
      title: "Delete Token",
      render: (token) => {
        const id = token.id;
        return (
          <Button
            className="px-4 mx-5"
            onClick={() => {
              deleteRechargeToken({ id });
            }}
          >
            <GoTrash />
          </Button>
        );
      },
    },
  ];

  const handleShowToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000); // Hides the toast after 3 seconds
  };
  useEffect(() => {
    if (assignResult?.isError || assignResult?.isSuccess) {
      handleShowToast();
    }
  }, [assignResult?.isError, assignResult?.isSuccess]);

  let renderMsg = null;
  if (assignResult.isError) {
    let msg = `Failed to delete id ${assignResult?.error?.data?.id}, message: ${assignResult?.error?.data?.message}`;
    renderMsg = (
      <div>{showToast && <ToastMessage type="error" message={msg} />}</div>
    );
  }
  if (assignResult?.isSuccess) {
    renderMsg = (
      <div>
        {showToast && (
          <ToastMessage
            type="success"
            message={"Successfully assigned admin"}
          />
        )}
      </div>
    );
  }

  const renderMore = () => {
    return (
      <form>
        <div className="flex mb-4">
          <label className={labelClassnames}>Value : </label>
          <input
            type="number"
            className={inputClassnames}
            onChange={(e) =>
              setFormData({ ...formData, value: parseInt(e.target.value) })
            }
          />
        </div>
        <div className="flex mb-4">
          <label className={labelClassnames}>Handler Name :</label>
          <input
            type="text"
            placeholder="Username of an Admin"
            className={inputClassnames}
            onChange={(e) =>
              setFormData({ ...formData, handler: e.target.value })
            }
          />
        </div>
        <div className="mt-4 flex justify-end">
          <Button
            onClick={(e) => {
              e.preventDefault();
              console.log(formData.value, formData.handler);
              createRechargeToken({
                value: formData.value,
                handler: formData.handler,
              });
            }}
            secondary
            rounded
            className="text-white mr-2 px-4 py-2 rounded-md focus:outline-none focus:bg-white focus:text-gray-800 hover:text-gray-800 hover:bg-white"
          >
            Create
          </Button>
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
  let headerContect = null;
  if (data?.permission?.includes("create-delete-recharge-token")) {
    headerContect = (
      <div className="flex justify-center mt-4 p-2">
        <Button
          secondary
          className="rounded focus:outline-none text-lg focus:bg-white focus:text-gray-800 hover:text-gray-800 hover:bg-white"
          onClick={() => setIsPanelOpen(!isPanelOpen)}
        >
          Create New Token
        </Button>
      </div>
    );
  }

  return (
    <div>
      <p className="font-semibold text-center text-2xl">Token List</p>
      {headerContect}
      <ItemTable
        config={config}
        query={useGetRechargeTokensQuery}
        result={deleteResult}
        perPage={20}
      />
      <PopUpPanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)}>
        <h2 className="flex justify-center font-semibold text-lg my-2">
          Create a New token
        </h2>
        {renderMore()}
      </PopUpPanel>
      {renderMsg}
    </div>
  );
};

export default RechargeTokenTable;
