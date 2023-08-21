import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { useGetUserByIDQuery } from "../Store";

const backEndURL = import.meta.env.VITE_BACKEND_URL;
const ProfileViewPage = () => {
  const { id } = useParams();
  const { data, isError, isLoading } = useGetUserByIDQuery({ id });

  if (isLoading) {
    return (
      <div className="flex items-center justify">
        <p className="text-blue-600 font-bold text-3xl">Loading...</p>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="flex items-center justify">
        <p className="text-red-600 font-bold text-3xl">Error occured</p>
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

  return (
    <div className="bg-white p-8 shadow-md rounded-md">
      <div className="flex">
        <img
          src={
            data?.user?.avatar
              ? `${backEndURL}${data?.user?.avatar}`
              : "https://cdn.onlinewebfonts.com/svg/img_329115.png"
          }
          alt={`${data?.user?.username}'s Avatar`}
          className="h-96 max-w-3xl"
        />
        <div className="p-4 ml-8">
          <h1 className="text-2xl font-semibold">
            {data?.user?.name} {status}
          </h1>
          <p className="text-gray-600">{data?.user?.username}</p>
          <p className="text-gray-800">{data?.user?.email}</p>
          <p className="text-gray-900 font-semibold">
            Contribution : {data?.user?.contribution}
          </p>
          <p className="text-gray-800">
            Country :{" "}
            {data?.user?.country ? data?.user?.country : "Not specified"}
          </p>
          <p className="text-gray-800">
            District :{" "}
            {data?.user?.district ? data?.user?.district : "Not specified"}
          </p>
        </div>
      </div>
      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">Posts</h2>
        <ul>
          {data?.user?.posts?.length !== 0 ? (
            data?.user?.posts.map((post, index) => (
              <li key={post?.id} className="mb-2">
                <span className="text-gray-500 mr-2 px-2">{index + 1}.</span>
                <a
                  href={`/posts/${post?.id}`}
                  className="text-blue-500 hover:underline"
                >
                  {post?.title}
                </a>
              </li>
            ))
          ) : (
            <p className="text-red-600">No posts</p>
          )}
        </ul>
      </div>
    </div>
  );
};

ProfileViewPage.propTypes = {
  id: PropTypes.number,
};

export default ProfileViewPage;
