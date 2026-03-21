import React, { useEffect } from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import Style from "../Style/Mode.module.scss";

const Mode = ({ darkMode, setDarkMode }) => {
  useEffect(() => {
    document.body.setAttribute("data-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <div className={Style.modeToggle}>
      <div
        className={`${Style.toggleButton} ${darkMode ? Style.dark : ""}`}
        onClick={() => setDarkMode((prev) => !prev)}
      >
        <div className={Style.iconWrap}>
          <span className={`${Style.icon} ${Style.sun}`}>
            <FaSun />
          </span>
          <span className={`${Style.icon} ${Style.moon}`}>
            <FaMoon />
          </span>
        </div>
      </div>
    </div>
  );
};

export default Mode;
