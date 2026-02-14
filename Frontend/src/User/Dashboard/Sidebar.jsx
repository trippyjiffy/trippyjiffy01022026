import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUserCircle,
  FaUserEdit,
  FaSignOutAlt,
} from "react-icons/fa";
import Style from "../Dashboard/Style/Sidebar.module.scss";

const Sidebar = ({ isOpen, toggleSidebar, isMobile }) => {
  const navigate = useNavigate();

  const handleLinkClick = () => {
    if (isMobile && isOpen) toggleSidebar();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.dispatchEvent(new CustomEvent("userLoggedIn", { detail: "Guest" }));

    if (isMobile && isOpen) toggleSidebar();
    navigate("/login");
  };

  return (
    <>
      {isMobile && (
        <button
          className={`${Style.mobileToggle} ${isOpen ? Style.toggle : ""}`}
          onClick={toggleSidebar}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      )}
      <aside
        className={`${Style.sidebar} ${isOpen ? Style.open : Style.closed} ${
          isMobile ? Style.mobile : ""
        }`}
      >
        <div className={Style.logo}>User Panel</div>
        <ul>
          <li>
            <NavLink
              to="/user"
              end
              onClick={handleLinkClick}
              className={({ isActive }) => (isActive ? Style.active : "")}
            >
              <FaTachometerAlt className={Style.icon} /> Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/user/profile"
              onClick={handleLinkClick}
              className={({ isActive }) => (isActive ? Style.active : "")}
            >
              <FaUserCircle className={Style.icon} /> Profile
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/user/edit"
              onClick={handleLinkClick}
              className={({ isActive }) => (isActive ? Style.active : "")}
            >
              <FaUserEdit className={Style.icon} /> Edit Profile
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/user/announcement"
              onClick={handleLinkClick}
              className={({ isActive }) => (isActive ? Style.active : "")}
            >
              <FaUserEdit className={Style.icon} /> Messages
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/user/UserDocument"
              onClick={handleLinkClick}
              className={({ isActive }) => (isActive ? Style.active : "")}
            >
              <FaUserEdit className={Style.icon} />
              UserDocument
            </NavLink>
          </li>
        </ul>

        <div className={Style.logout} onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
