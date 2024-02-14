import { useEffect, useState } from "react";
import { useGetUserByUsernameMutation } from "../Store";
import { Link } from "react-router-dom";

const UserSearchPanel = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [getUserByUsername, result] = useGetUserByUsernameMutation();

  const handleSearchClick = () => {
    getUserByUsername({ username: searchTerm });
  };

  useEffect(() => {
    if (result.isSuccess) {
      setSearchResults(result.data.users);
    }
    if (result.isError) {
      setSearchResults([]);
    }
  }, [result?.data?.users, result?.isError, result?.isSuccess]);

  return (
    <div className="space-y-2 p-4">
      <div className="flex">
        <label className="input input-bordered flex items-center gap-2">
          <input
            type="text"
            className="grow"
            placeholder="Search user"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClick={handleSearchClick}
            disabled={result.isLoading}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="w-4 h-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
        </label>
      </div>
      <div className="max-h-[100px] overflow-y-auto">
        <ul className="space-y-2">
          {searchResults.length === 0 && !result?.isUninitialized ? (
            <p>No user found</p>
          ) : (
            searchResults.map((user, index) => (
              <li key={index} className="flex items-center justify-between">
                <Link
                  to={`/get-user/${user.id}`}
                  className="flex items-center space-x-2"
                >
                  <div className="w-7 h-7 rounded-full bg-gray-700 text-white flex items-center justify-center">
                    {user.username
                      .split(" ")
                      .map((username) => username[0])
                      .join("")}
                  </div>
                  <span className="hover:text-green-800 hover:underline">
                    {user.username}
                  </span>
                </Link>

                <div
                  className={`w-2 h-2 rounded-full ${
                    user.status === "Active" ? "bg-green-500" : "bg-yellow-500"
                  }`}
                  title={user.status === "Active" ? "Active" : "Inactive"}
                ></div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default UserSearchPanel;
