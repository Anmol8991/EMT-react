import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Views from "../../views/Views"
import Sidebar from "./sidebar/Sidebar.jsx";
import Sidebar2 from "./sidebar/Sidebar2.jsx";
import Topbar from "./topbar/Topbar.jsx"
import { useUserContext } from "../../hooks/useUserContext.js";
import './sidebar.css'


const DefaultLayout = () => {
  // const { user } = useUserContext();
  const [sidebarToggled, setSidebarToggled] = useState(false);
  // const theme = useTheme();
  const navigate = useNavigate();
  // const isLScreen = useMediaQuery(theme.breakpoints.up("l"));

  // useEffect(() => {
  //   if (isLScreen) {
  //     setSidebarToggled(true);
  //   } else {
  //     setSidebarToggled(false);
  //   }
  // }, [isLScreen]);

  const handleToggle = () => {
    setSidebarToggled(!sidebarToggled);
    localStorage.setItem("sb|sidebar-toggle", !sidebarToggled);

    // DOM manipulation using vanilla js in react is discouraged let react handle all the DOM manipulation
    // document.querySelector('.sb-nav-fixed').classList.toggle("sb-sidenav-toggled");
    // localStorage.setItem('sb|sidebar-toggle', document.querySelector('.sb-nav-fixed').classList.contains('sb-sidenav-toggled'));
  };
  return (
    <>
      <div
        className={`sb-nav-fixed ${sidebarToggled ? "sb-sidenav-toggled" : ""}`}
      >
        <Topbar handleToggle={handleToggle} />
        <div id="layoutSidenav">
          <Sidebar />
          <div id="layoutSidenav_content">
            <Views />
          </div>
        </div>
      </div>
    </>
  );
};

export default DefaultLayout;
