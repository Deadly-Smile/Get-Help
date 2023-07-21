import classNames from "classnames";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const Navbar = ({ linkList }) => {
  const navLinkClasses = classNames(
    "text-white font-semibold hover:underline hover:text-green-100"
  );
  const renderLinks = linkList.map((link, index) => {
    return (
      <li key={index}>
        <Link to={`${link.link}`} className={navLinkClasses}>
          {link.label}
        </Link>
      </li>
    );
  });
  return (
    <div>
      <nav className="bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <Link
                to="/"
                className="text-white text-xl font-bold hover:text-green-100 hover:underline"
              >
                Home
              </Link>
            </div>
            <div className="md:block">
              <ul className="flex space-x-4">{renderLinks}</ul>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

Navbar.propTypes = {
  linkList: PropTypes.array.isRequired,
};

export default Navbar;
