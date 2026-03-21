import React, { useEffect, useState } from "react";
import Style from "../Dashboard/Style/UserEdit.module.scss";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserEdit = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [overlayPassword, setOverlayPassword] = useState(false);
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please login.");

        const { data } = await axios.get(`${baseURL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser({ ...data, password: "" });
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to fetch user profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [baseURL]);

  const handleChange = (e) =>
    setUser({ ...user, [e.target.name]: e.target.value });

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${baseURL}/api/users/update/users/${user.id}`, user);
      alert("User updated successfully ✅");
      setShowOverlay(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update user ❌");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this user? ❌"))
      return;
    try {
      await axios.delete(`${baseURL}/api/users/delete/users/${user.id}`);
      alert("User deleted successfully ✅");
      navigate("/users");
    } catch (err) {
      console.error(err);
      alert("Failed to delete user ❌");
    }
  };

  if (loading) return <p className={Style.message}>Loading profile...</p>;
  if (error)
    return <p className={`${Style.message} ${Style.error}`}>{error}</p>;
  if (!user) return <p className={Style.error}>No user data found.</p>;

  return (
    <div className={Style.Profile}>
      <h2>User Profile</h2>
      <div className={Style.userInfo}>
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Mobile:</strong> {user.mobile}
        </p>
        <p>
          <strong>Country:</strong> {user.country}
        </p>
        <p>
          <strong>Password:</strong>{" "}
          {showPassword ? user.password || "Not set" : "********"}
          <button
            type="button"
            className={Style.showBtn}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </p>
      </div>
      <div className={Style.buttons}>
        <button
          onClick={() => setShowOverlay(true)}
          className={Style.updateButton}
        >
          Edit User
        </button>
        <button onClick={handleDelete} className={Style.deleteButton}>
          Delete User
        </button>
      </div>
      {showOverlay && (
        <div
          className={Style.PopupOverlay}
          onClick={(e) => e.target === e.currentTarget && setShowOverlay(false)}
        >
          <div className={Style.PopupBox}>
            <h2>Edit User</h2>
            <form onSubmit={handleUpdate} className={Style.popupForm}>
              <div className={Style.formGroup}>
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                />
              </div>

              <div className={Style.formGroup}>
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                />
              </div>

              <div className={Style.formGroup}>
                <label>Mobile</label>
                <input
                  type="text"
                  name="mobile"
                  value={user.mobile}
                  onChange={handleChange}
                />
              </div>

              <div className={Style.formGroup}>
                <label>Country</label>
                <input
                  type="text"
                  name="country"
                  value={user.country}
                  onChange={handleChange}
                />
              </div>

              <div className={Style.formGroup}>
                <label>Password</label>
                <div className={Style.passwordWrapper}>
                  <input
                    type={overlayPassword ? "text" : "password"}
                    name="password"
                    value={user.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className={Style.showBtn}
                    onClick={() => setOverlayPassword(!overlayPassword)}
                  >
                    {overlayPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <small>
                  (Leave blank if you don’t want to change password)
                </small>
              </div>

              <div className={Style.actions}>
                <button type="submit" className={Style.updateButton}>
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => setShowOverlay(false)}
                  className={Style.cancelButton}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserEdit;
