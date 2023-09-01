import React from "react";
import { useNavigate } from "react-router-dom";
import AuthorityCheck from "../../../AuthorityCheck";
import { useUserContext } from "../../../../hooks/useUserContext";

// import * as icons from 'react-bootstrap-icons';

const VerticalSingleMenuItem = ({ nav }) => {
    const { user } = useUserContext();
  const navigate = useNavigate();
  // const BootstrapIcon = icons[nav.icon];
  
  // console.log("Navigation: ",nav.key);
  return (
    <AuthorityCheck userAuthority={user?.roleId} navigationAuthority={nav.authority}>
      <a className="nav-link" onClick={() => navigate(`${nav.path}`)}>
        <div className="sb-nav-link-icon">
        { nav.icon !== '' && (<div className="sb-nav-link-icon">
          <i className={`${nav.icon}`}></i>
        </div>)}
        </div>
        {nav.title}
      </a>
    </AuthorityCheck>
  );
};

export default VerticalSingleMenuItem;
