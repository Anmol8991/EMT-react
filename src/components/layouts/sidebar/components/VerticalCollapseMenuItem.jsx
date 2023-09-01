import React from "react";
import AuthorityCheck from "../../../AuthorityCheck";
import { useNavigate } from "react-router-dom";
import VerticalSingleMenuItem from "./VerticalSingleMenuItem";
import { useUserContext } from "../../../../hooks/useUserContext";


const VerticalCollapseMenuItem = ({ nav }) => {
  const {user} = useUserContext()
  return (
    <AuthorityCheck userAuthority={user?.roleId} navigationAuthority={nav.authority}>
      <a
        className="nav-link collapsed"
        href="#"
        data-bs-toggle="collapse"
        data-bs-target="#collapseLayouts"
        aria-expanded="false"
        aria-controls="collapseLayouts"
      >
        { nav.icon !== '' && (<div className="sb-nav-link-icon">
          <i className={`${nav.icon}`}></i>
        </div>)}
        {nav.title}
        <div className="sb-sidenav-collapse-arrow">
          <i className="fas fa-angle-down"></i>
        </div>
      </a>
      <div
        className="collapse"
        id="collapseLayouts"
        aria-labelledby="headingOne"
        data-bs-parent="#sidenavAccordion"
      >
        <nav className="sb-sidenav-menu-nested nav">
          {nav.subMenu.map((item) => (
            <VerticalSingleMenuItem key={item.key} nav={item} />
          ))}
        </nav>
      </div>
    </AuthorityCheck>
  );
};

export default VerticalCollapseMenuItem;
