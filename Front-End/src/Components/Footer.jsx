import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import classNames from "classnames";

const Footer = ({ className, linkList, website }) => {
  const finalClassNames = classNames(
    "bg-gray-900 py-4 text-white  h-auto",
    className
  );
  const linkClasses = classNames(
    "text-gray-300 text-sm hover:underline hover:text-green-100"
  );
  const renderLinks = linkList.map((link, index) => {
    return (
      <li key={index}>
        <Link to={`${link.link}`} className={linkClasses}>
          {link.label}
        </Link>
      </li>
    );
  });
  return (
    <footer className={finalClassNames}>
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <div>
            <p className="m-0 font-thin text-sm text-gray-400">
              &copy; 2023 {website}
            </p>
          </div>
          <div>
            <ul className="flex space-x-4">{renderLinks}</ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

Footer.propTypes = {
  linkList: PropTypes.array.isRequired,
  website: PropTypes.string.isRequired,
  className: PropTypes.object,
};

export default Footer;
