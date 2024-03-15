import PropTypes from "prop-types";
import { Link, useParams } from "react-router-dom";
import {
  useAddMoneyMutation,
  useDonateToMutation,
  useGetUserByIDQuery,
} from "../Store";
import Button from "../Components/Button";
import { useContext, useState, useEffect } from "react";
import MsgListContext from "../Context/MsgListContext";
import UserContext from "../Context/UserContext";
import PopUpPanel from "../Components/PopUpPanel";
import classNames from "classnames";
import ToastMessage from "../Components/ToastMessage";
import LoadingContext from "../Context/LoadingContext";

const backEndURL = import.meta.env.VITE_BACKEND_URL;
const ProfileViewPage = () => {
  const { id } = useParams();
  const { data, isError, isLoading } = useGetUserByIDQuery({ id });
  const isLoadingContext = useContext(LoadingContext);
  const [addMoney, addMoneyResult] = useAddMoneyMutation();
  const [donateTo, donateResult] = useDonateToMutation();
  const { addMsgPanel } = useContext(MsgListContext);
  const conObj = useContext(UserContext);
  const [isRechargePanelOpen, setIsRechargePanelOpen] = useState(false);
  const [isDonatePanelOpen, setIsDonatePanelOpen] = useState(false);
  const [donate, setDonate] = useState(0);
  const [formData, setFormData] = useState({
    value: 0,
  });
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (isLoading || addMoneyResult?.isLoading || donateResult?.isLoading) {
      isLoadingContext.setProgress(30);
    } else {
      isLoadingContext.setProgress(100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addMoneyResult?.isLoading, donateResult?.isLoading, isLoading]);

  const labelClassnames = classNames(
    "text-sm font-bold mr-2 w-1/4 flex items-center justify-start"
  );
  const inputClassnames = classNames(
    "w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
  );

  const handleShowToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000); // Hides the toast after 3 seconds
  };
  useEffect(() => {
    if (
      addMoneyResult?.isError ||
      addMoneyResult?.isSuccess ||
      isError ||
      donateResult?.isError ||
      donateResult?.isSuccess
    ) {
      handleShowToast();
    }
  }, [
    addMoneyResult?.isError,
    addMoneyResult?.isSuccess,
    donateResult?.isError,
    donateResult?.isSuccess,
    isError,
  ]);

  let renderMsg = null;
  if (donateResult?.isError) {
    // console.log(donateResult);
    let msg = "Failed to Donate";
    if (donateResult?.error?.data?.error)
      msg = donateResult?.error?.data?.error;
    renderMsg = (
      <div>{showToast && <ToastMessage type="error" message={msg} />}</div>
    );
  }
  if (donateResult?.isSuccess) {
    renderMsg = (
      <div>
        {showToast && (
          <ToastMessage type="success" message={"Successfully Donated"} />
        )}
      </div>
    );
  }
  if (addMoneyResult.isError) {
    renderMsg = (
      <div>
        {showToast && <ToastMessage type="error" message={"Incorrect Token"} />}
      </div>
    );
  }
  if (addMoneyResult?.isSuccess) {
    renderMsg = (
      <div>
        {showToast && (
          <ToastMessage type="success" message={"Successfully Added Money"} />
        )}
      </div>
    );
  }
  if (isError) {
    renderMsg = (
      <div>
        {showToast && (
          <ToastMessage type="error" message={"Error Occured!!!"} />
        )}
      </div>
    );
  }

  let status = null;
  if (data?.user?.isMaster) {
    status = <span className="text-gray-600 font-normal">(Master)</span>;
    if (data?.user?.isDoctor) {
      status = (
        <span className="text-gray-600 font-normal">(Master & Doctor)</span>
      );
    }
  } else if (data?.user?.isAdmin) {
    status = <span className="text-gray-600 font-normal">(Admin)</span>;
    if (data?.user?.isDoctor) {
      status = (
        <span className="text-gray-600 font-normal">(Admin & Doctor)</span>
      );
    }
  } else if (data?.user?.isDoctor) {
    status = <span className="text-gray-600 font-normal">(Doctor)</span>;
  }

  const rechargePanel = () => {
    return (
      <form>
        <div className="flex mb-4">
          <label className={labelClassnames}>Token : </label>
          <input
            type="number"
            className={inputClassnames}
            onChange={(e) => setFormData({ value: parseInt(e.target.value) })}
          />
        </div>
        <div className="mt-4 flex justify-end">
          <Button
            onClick={(e) => {
              e.preventDefault();
              addMoney({ token: formData.value });
              setIsRechargePanelOpen(!isRechargePanelOpen);
            }}
            secondary
            rounded
            className="text-white mr-2 px-4 py-2 rounded-md focus:outline-none focus:bg-white focus:text-gray-800 hover:text-gray-800 hover:bg-white"
          >
            Submit
          </Button>
          <Button
            onClick={(event) => {
              event.preventDefault();
              setIsRechargePanelOpen(!isRechargePanelOpen);
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

  const donatePanel = (id) => {
    return (
      <form>
        <div className="flex mb-4">
          <label className={labelClassnames}>Amount : </label>
          <input
            type="number"
            className={inputClassnames}
            onChange={(e) => setDonate(parseInt(e.target.value))}
          />
        </div>
        <div className="mt-4 flex justify-end">
          <Button
            onClick={(e) => {
              e.preventDefault();
              // console.log(id);
              donateTo({ amount: donate, id });
              // addMoney({ token: formData.value });
              setIsDonatePanelOpen(!isDonatePanelOpen);
            }}
            secondary
            rounded
            className="text-white mr-2 px-4 py-2 rounded-md focus:outline-none focus:bg-white focus:text-gray-800 hover:text-gray-800 hover:bg-white"
          >
            Submit
          </Button>
          <Button
            onClick={(event) => {
              event.preventDefault();
              setIsDonatePanelOpen(!isDonatePanelOpen);
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

  return (
    <div className="rounded-md">
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col lg:flex-row">
          <img
            src={
              data?.user?.avatar
                ? `${backEndURL}${data?.user?.avatar}`
                : "https://cdn.onlinewebfonts.com/svg/img_329115.png"
            }
            alt={`${data?.user?.username}'s Avatar`}
            className="max-w-sm rounded-lg shadow-2xl"
          />
          <div>
            <h1 className="text-5xl font-bold p-4 ml-8">
              {data?.user?.name} {status}
            </h1>
            <div className="p-4 ml-8">
              <p className="">{data?.user?.username}</p>
              {/* <p className="text-gray-800">{data?.user?.email}</p> */}
              <p className="font-semibold">
                Contribution : {data?.user?.contribution}
              </p>
              <p className="flex">
                Status :{" "}
                <span className="ml-1">
                  {data?.user.status === "Active" ? "Active" : "Inactive"}
                </span>
              </p>
              <p className="">
                Country :{" "}
                {data?.user?.country ? data?.user?.country : "Not specified"}
              </p>
              <p className="">
                District :{" "}
                {data?.user?.district ? data?.user?.district : "Not specified"}
              </p>
              {conObj?.data?.user?.id == id ? (
                <p>Balance : {conObj?.data?.user?.balance}</p>
              ) : null}
              {conObj?.data?.user?.id == id ? (
                <div>
                  <Button className="mt-2 rounded" secondary>
                    <Link to={"/home/edit-profile"}>Edit Info</Link>
                  </Button>
                </div>
              ) : null}
              {conObj?.data?.user?.id == id ? (
                <div>
                  <Button
                    onClick={() => setIsRechargePanelOpen(!isRechargePanelOpen)}
                    className="mt-2 rounded"
                    secondary
                  >
                    Add Money
                  </Button>
                  <PopUpPanel
                    isOpen={isRechargePanelOpen}
                    onClose={() => setIsRechargePanelOpen(false)}
                  >
                    <h2 className="flex justify-center font-semibold text-lg my-2">
                      Add Money by Token
                    </h2>
                    {rechargePanel()}
                  </PopUpPanel>
                </div>
              ) : null}
              {conObj?.data?.user?.id != id && (
                <Button
                  onClick={() => {
                    // console.log(data);
                    addMsgPanel({
                      userId: id,
                      username: data?.user?.username,
                      avater: data?.user?.avatar,
                    });
                  }}
                  className="mt-2 rounded"
                  secondary
                >
                  Contact
                </Button>
              )}
              {conObj?.data?.user?.id != id ? (
                <div>
                  <Button
                    className="mt-2 rounded"
                    secondary
                    onClick={() => setIsDonatePanelOpen(!isDonatePanelOpen)}
                  >
                    Donate
                  </Button>
                  <PopUpPanel
                    isOpen={isDonatePanelOpen}
                    onClose={() => setIsDonatePanelOpen(false)}
                  >
                    <h2 className="flex justify-center font-semibold text-lg my-2">
                      Donate Money
                    </h2>
                    {donatePanel(id)}
                  </PopUpPanel>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 mx-24">
        <h2 className="text-lg font-semibold mb-2">Posts</h2>
        <ul>
          {data?.user?.posts?.length !== 0 ? (
            data?.user?.posts.map((post, index) => (
              <li key={post?.id} className="mb-2">
                <span className="mr-2 px-2">{index + 1}.</span>
                <Link
                  to={`/home/posts/${post?.id}`}
                  className="text-blue-500 hover:underline"
                >
                  {post?.title}
                </Link>
              </li>
            ))
          ) : (
            <p className="text-red-600">No posts</p>
          )}
          {renderMsg}
        </ul>
      </div>
    </div>
  );
};

ProfileViewPage.propTypes = {
  id: PropTypes.number,
};

export default ProfileViewPage;
