import React from "react";
import navigationConfig from "../../../config/navigation.config";
import VerticalSingleMenuItem from "./components/VerticalSingleMenuItem";
import VerticalCollapseMenuItem from "./components/VerticalCollapseMenuItem";


const Sidebar = () => {
  const getNavItem = (nav) => {
    if (nav.subMenu.length === 0 && nav.type === "item") {
      return <VerticalSingleMenuItem key={nav.key} nav={nav} />;
    }

    if (nav.subMenu.length > 0 && nav.type === "collapse") {
      return <VerticalCollapseMenuItem key={nav.key} nav={nav} />;
    }
  };

  return (
    <div id="layoutSidenav_nav">
      <nav
        className="sb-sidenav accordion sb-sidenav-dark"
        id="sidenavAccordion"
      >
        <div className="sb-sidenav-menu">
          <div className="nav">
            {navigationConfig.map((nav) => getNavItem(nav))}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
