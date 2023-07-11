import { Link } from "react-router-dom";
import UsersTable from "../Components/UsersTable";

const HomePage = () => {
  return (
    <div>
      <p>
        <Link to="/about">About</Link>
      </p>
      <p>
        <Link to="*">Not Found</Link>
      </p>
      <p>
        <Link to="/login">Log in</Link>
      </p>
      <p>
        <Link to="/signup">Sign up</Link>
      </p>
      <h2>Users:</h2>
      <UsersTable />
    </div>
  );
};

export default HomePage;
