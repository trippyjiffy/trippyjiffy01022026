import React, { useEffect, useState } from "react";
import axios from "axios";
import Style from "../Dashboard/Style/Profile.module.scss";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found. Please login.");
          return;
        }

        const response = await axios.get(`${baseURL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data) {
          setUser(response.data);
        } else {
          setError("No user data found.");
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setError("Failed to fetch user profile.");
      }
    };

    fetchUserProfile();
  }, [baseURL]);

  return (
    <div className={Style.Profile}>
      <h2>User Profile</h2>
      {error && <p className={Style.error}>{error}</p>}

      {user ? (
        <div className={Style.info}>
          <div className={Style.item}>
            <span className={Style.label}>Name:</span>
            <span className={Style.value}>{user.name}</span>
          </div>
          <div className={Style.item}>
            <span className={Style.label}>Email:</span>
            <span className={Style.value}>{user.email}</span>
          </div>
          <div className={Style.item}>
            <span className={Style.label}>Mobile:</span>
            <span className={Style.value}>{user.mobile}</span>
          </div>
          <div className={Style.item}>
            <span className={Style.label}>Country:</span>
            <span className={Style.value}>{user.country}</span>
          </div>
        </div>
      ) : (
        !error && <p className={Style.loading}>Loading profile...</p>
      )}
    </div>
  );
};

export default Profile;
