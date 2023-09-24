import { useContext, useEffect, useState } from "react";
import UserContext from "../Context/UserContext";
import Footer from "./Footer";

const FooterConfig = () => {
  const { data, isSuccess } = useContext(UserContext);
  const [activeFooterLinks, setActiveFooterLinks] = useState([
    { label: "Privacy Policy", link: "#" },
    { label: "Terms of Service", link: "#" },
    { label: "Contact", link: "#" },
    { label: "Buy me a cup of coffee", link: "#" },
  ]);
  useEffect(() => {
    let defaultFooterLinks = [
      { label: "Privacy Policy", link: "#" },
      { label: "Terms of Service", link: "#" },
      { label: "Contact", link: "#" },
      { label: "Buy me a cup of coffee", link: "#" },
    ];

    if (isSuccess && data && data.user) {
      const footerLinkWithPermission = [
        { label: "Privacy Policy", link: "#" },
        { label: "Terms of Service", link: "#" },
        { label: "Contact", link: "#" },
        { label: "Buy me a cup of coffee", link: "#" },
        { label: "Become an Admin", link: "/apply-for-admin" },
      ];

      if (data.permission.includes("edit-post-table")) {
        footerLinkWithPermission.splice(1, 0, {
          label: "Post Table",
          link: "/post-table",
        });
      }
      setActiveFooterLinks(footerLinkWithPermission);
    } else {
      setActiveFooterLinks(defaultFooterLinks);
    }
  }, [data, isSuccess]);
  return <Footer linkList={activeFooterLinks} website="Get Help" />;
};

export default FooterConfig;
