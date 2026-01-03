import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/SellerLayout.css";

const SellerLayout = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const navigate = useNavigate();

  const doLogout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/api/auth/logout",
        {},
        { withCredentials: true }
      );
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="seller-container">

      <aside className="seller-sidebar">
        <h2 className="logo">Spotify Seller</h2>

        <Link to="/seller/dashboard" className="sidebar-link">Dashboard</Link>
        <Link to="/upload-song" className="sidebar-link">Upload Song</Link>
        <Link to="/my-songs" className="sidebar-link">My Songs</Link>
      </aside>

      <main className="seller-main">

        <div className="seller-navbar">
          <h3>Seller Panel</h3>

          <div className="nav-right">
            <button
              className="profile-btn"
              onClick={() => setOpen(!open)}
            >
              Profile ⌄
            </button>

            {open && (
              <div className="profile-dropdown">
                <p onClick={() => navigate("/profile")}>👤 Edit Profile</p>
                <p onClick={() => navigate("/settings")}>⚙️ Settings</p>
                <p className="logout-btn" onClick={() => setConfirmLogout(true)}>🚪 Logout</p>
              </div>
            )}
          </div>
        </div>

        {confirmLogout && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h3>Are you sure?</h3>
              <p>You want to logout?</p>

              <div className="modal-actions">
                <button
                  className="cancel-btn"
                  onClick={() => setConfirmLogout(false)}
                >
                  Cancel
                </button>

                <button
                  className="logout-confirm-btn"
                  onClick={doLogout}
                >
                  Yes, Logout
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="seller-content">{children}</div>

      </main>

    </div>
  );
};

export default SellerLayout;
