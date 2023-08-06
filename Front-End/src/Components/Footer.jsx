import { Link } from "react-router-dom";
import classNames from "classnames";

const Footer = ({ className }) => {
  const finalClassNames = classNames(
    "bg-gray-900 py-4 text-white  h-auto",
    className
  );
  const linkClasses = classNames(
    "text-gray-300 text-sm hover:underline hover:text-green-100"
  );
  return (
    <footer className={finalClassNames}>
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <div>
            <p className="m-0 font-thin text-sm text-gray-400">
              &copy; 2023 Your Website
            </p>
          </div>
          <div>
            <ul className="flex space-x-4">
              <li>
                <Link to="/" className={linkClasses}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/" className={linkClasses}>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/" className={linkClasses}>
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/" className={linkClasses}>
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/apply-for-admin" className={linkClasses}>
                  Become an Admin
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
