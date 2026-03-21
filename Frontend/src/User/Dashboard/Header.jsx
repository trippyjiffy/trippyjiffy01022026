// import React, { useEffect, useState } from "react";
// import Style from "../Dashboard/Style/Header.module.scss";
// import { FaSignOutAlt, FaUserCircle } from "react-icons/fa";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const Header = () => {
//   const [userName, setUserName] = useState("Loading...");
//   const baseURL = import.meta.env.VITE_API_BASE_URL;
//   const navigate = useNavigate();

//   const fetchUserName = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) return setUserName("Guest");

//       const response = await axios.get(`${baseURL}/api/users/me`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (response.data && response.data.name) setUserName(response.data.name);
//       else setUserName("Guest");
//     } catch (error) {
//       console.error("Failed to fetch user:", error);
//       setUserName("Guest");
//     }
//   };

//   useEffect(() => {
//     fetchUserName();

//     const handleLoginEvent = (e) => {
//       setUserName(e.detail);
//     };
//     window.addEventListener("userLoggedIn", handleLoginEvent);

//     return () => window.removeEventListener("userLoggedIn", handleLoginEvent);
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setUserName("Guest");
//     navigate("/login");
//   };

//   return (
//     <header className={Style.DeshboardHeader}>
//       <div className={Style.wrapper}>
//         <div className={Style.DeshboardHeaderFlex}>
//           <div className={Style.DeshboardHeaderLeft}>
//             <h2> User Dashboard</h2>
//           </div>
//           <div className={Style.DeshboardHeaderRight}>
//             <div className={Style.userInfo}>
//               <FaUserCircle className={Style.userIcon} />
//               <span className={Style.userName}>{userName}</span>
//             </div>
//             <button className={Style.logoutBtn} onClick={handleLogout}>
//               <FaSignOutAlt /> Logout
//             </button>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;
import React, { useEffect, useState } from "react";
import Style from "../Dashboard/Style/Header.module.scss";
import { FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [userName, setUserName] = useState("Guest");
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  // Fetch user info from API
  const fetchUserName = async () => {
    const token = localStorage.getItem("token");
    if (!token) return setUserName("Guest");

    try {
      const response = await axios.get(`${baseURL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Set name if available
      setUserName(response.data?.name || "Guest");
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setUserName("Guest");
    }
  };

  // Run on component mount
  useEffect(() => {
    fetchUserName();

    // Listen for login events
    const handleLogin = (e) => {
      setUserName(e.detail); // e.detail me username aayega login ke baad
    };
    window.addEventListener("userLoggedIn", handleLogin);

    return () => window.removeEventListener("userLoggedIn", handleLogin);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUserName("Guest");
    navigate("/login");
  };

  return (
    <header className={Style.DeshboardHeader}>
      <div className={Style.wrapper}>
        <div className={Style.DeshboardHeaderFlex}>
          <div className={Style.DeshboardHeaderLeft}>
            <h2>User Dashboard</h2>
          </div>
          <div className={Style.DeshboardHeaderRight}>
            <div className={Style.userInfo}>
              <FaUserCircle className={Style.userIcon} />
              <span className={Style.userName}>{userName}</span>
            </div>
            <button className={Style.logoutBtn} onClick={handleLogout}>
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

