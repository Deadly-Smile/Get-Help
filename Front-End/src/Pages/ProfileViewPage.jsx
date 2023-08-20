// import { useState } from "react";
import PropTypes from "prop-types";
import { useGetUserByIDQuery } from "../Store";

const ProfileViewPage = ({ id }) => {
  // const [user, setUser] = useState({});
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

  return (
    <div className="bg-white p-8 shadow-md rounded-md">
      <div className="flex items-center">
        <img
          src={data?.user?.avatar}
          alt={`${data?.user?.username}'s Avatar`}
          className="w-16 h-16 rounded-full mr-4"
        />
        <div>
          <h1 className="text-2xl font-semibold">{data?.user?.username}</h1>
          <p className="text-gray-600">{data?.user?.bio}</p>
        </div>
      </div>
      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">Posts</h2>
        <ul>
          {data?.user.posts.map((post) => (
            <li key={post.id} className="mb-2">
              <a
                href={`/posts/${post.id}`}
                className="text-blue-500 hover:underline"
              >
                {post.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

ProfileViewPage.propTypes = {
  id: PropTypes.number,
};

export default ProfileViewPage;
