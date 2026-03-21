import React, { useEffect, useState } from "react";
import Style from "../Dashboard/Style/UserDashboard.module.scss";

const UserDashboard = () => {
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.name) {
      setUserName(user.name);
    }
  }, []);

  return (
    <div className={Style.UserDashboard}>
      <h2 className={Style.welcomeTitle}>
        Welcome back, <span className={Style.userHighlight}>{userName} 👋</span>
      </h2>
      <p className={Style.subtitle}>
        You are successfully logged in. Enjoy your personalized dashboard!
      </p>

      <div className={Style.StatsRow}>
        <div className={Style.Card}>
          <h3>Hello, {userName}!</h3>
          <p>
            Your login is active. You can now explore your profile, edit
            information, and manage your account.
          </p>
        </div>

        <div className={Style.Card}>
          <h3>Quick Tips</h3>
          <ul>
            <li>Update your profile regularly.</li>
            <li>Check notifications for new messages.</li>
            <li>Keep your password secure 🔒.</li>
          </ul>
        </div>

        <div className={Style.Card}>
          <h3>Motivation</h3>
          <p>“The secret of getting ahead is getting started.” – Mark Twain</p>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
