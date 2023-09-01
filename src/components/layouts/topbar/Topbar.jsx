import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../../hooks/useUserContext";
import { apiLogout } from "../../../api/auth.api";
import { notify } from "../../../utils/toastify";
import Loading from "../../../components/loader/Loading";
import useAuth from "../../../hooks/useAuth";

const Topbar = ({ handleToggle }) => {
  const { signOut } = useAuth();
  const { user } = useUserContext();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogOut() {
    try {
      const response = await apiLogout();
      console.log(
        "Response to logout request in Topbar Component: ",
        response?.data?.data
      );
    } catch (error) {
      // notify(error?.response?.data?.message);
      console.log("Error in Topbar Component: ", error);
    } finally {
      signOut();
    }
  }

  function handleUserProfile() {
    // redirect to userProfile Page screen
    // console.log("Log in Topbar Component: redirect");
    navigate("/profile");
  }
  return (
    <>
      {isLoading && <Loading />}
      <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark">
        <button
          className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0 text-white fs-2"
          onClick={handleToggle}
        >
          <i className="fas fa-bars"></i>
        </button>
        {/* <button className="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBackdrop" aria-controls="offcanvasWithBackdrop">Enable backdrop (default)</button> */}
        <a className="navbar-brand ps-3" href="#">
          EMT
        </a>

        <div className="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0"></div>
        <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-0 order-lg-2">
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle d-flex align-items-center"
              id="navbarDropdown"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {user.name}
              { typeof user.profile === 'undefined' ? (<i className="fas fa-user fa-fw"></i>): (<div className="user-avatar-container">
                <img
                  src={user.profile}
                  alt="Rounded circle Image"
                  className="rounded-circle user-avatar"
                />
              </div>)}
            </a>
            <ul
              className="dropdown-menu dropdown-menu-end dropdown-menu-dark"
              aria-labelledby="navbarDropdown"
            >
              <li>
                <a
                  className="dropdown-item"
                  href="#!"
                  onClick={handleUserProfile}
                >
                  Profile
                </a>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <a className="dropdown-item" href="#!" onClick={handleLogOut}>
                  Logout
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Topbar;
