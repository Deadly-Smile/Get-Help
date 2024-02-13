import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import ToggleTheme from "./ToggleTheme";

const Navbar = ({ linkList, parentLinkList, manageLinkList, userName }) => {
  const [isParent, setIsParent] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const renderLinks = useMemo(() => {
    return (list, name) => {
      if (!list) return null;
      return list.map((link, index) => (
        <li key={`${name}.${index}`}>
          <Link to={`${link.link}`}>{link.label}</Link>
        </li>
      ));
    };
  }, []);

  useEffect(() => {
    setIsParent(!!parentLinkList?.length);
  }, [parentLinkList]);

  useEffect(() => {
    setIsManager(!!manageLinkList?.length);
  }, [manageLinkList]);

  useEffect(() => {
    if (!userName) {
      setIsManager(false);
      setIsParent(false);
    }
  }, [userName]);

  return (
    <div className="navbar bg-base-100">
      <div className="flex-1 ">
        <Link to="/" className="btn btn-ghost text-xl">
          Get Help
        </Link>
      </div>
      <div className="navbar-end">
        <ul className="menu menu-horizontal px-1">
          {renderLinks(linkList, "linkList")}
          {isManager && (
            <li>
              <details>
                <summary>Admin Options</summary>
                <ul className="p-2 bg-base-100 rounded-t-none">
                  {renderLinks(manageLinkList, "managerList")}
                </ul>
              </details>
            </li>
          )}
          {isParent && (
            <li>
              <details>
                <summary>{userName}</summary>
                <ul className="p-2 bg-base-100 rounded-t-none">
                  {renderLinks(parentLinkList, "parentList")}
                </ul>
              </details>
            </li>
          )}
        </ul>
        <ToggleTheme />
      </div>
    </div>
  );
};

Navbar.propTypes = {
  linkList: PropTypes.array.isRequired,
  parentLinkList: PropTypes.array,
  manageLinkList: PropTypes.array,
  userName: PropTypes.string,
};

export default Navbar;
