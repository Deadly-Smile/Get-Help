import { useEffect, useState } from "react";
import { useGetUserByUsernameMutation } from "../Store";
import { GoSearch, GoIssueReopened } from "react-icons/go";
import Button from "./Button";

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
    <div className="space-y-4">
      <p className="md-0 font-light text-sm text-gray-600">Search User</p>
      <div className="flex">
        <input
          type="text"
          placeholder="Search"
          className="w-full px-3 focus:outline-none focus:ring focus:border-blue-300 bg-slate-100"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button
          className={`flex items-center justify-center text-white px-1 py-1 focus:outline-none focus:bg-white focus:text-gray-800 hover:text-gray-800 hover:bg-white disabled:bg-slate-400`}
          secondary
          onClick={handleSearchClick}
          disabled={result.isLoading}
        >
          {result.isLoading ? <GoIssueReopened /> : <GoSearch />}
        </Button>
      </div>
      <div>
        <ul className="space-y-2">
          {searchResults.length === 0 ? (
            <p>No user found</p>
          ) : (
            searchResults.map((user, index) => (
              <li key={index} className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-full bg-gray-700 text-white flex items-center justify-center">
                  {user.username
                    .split(" ")
                    .map((username) => username[0])
                    .join("")}
                </div>
                <span>{user.username}</span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default UserSearchPanel;
