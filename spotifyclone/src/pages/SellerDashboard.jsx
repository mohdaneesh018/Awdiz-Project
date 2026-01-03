import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import SellerLayout from "../pages/SellerLayout";
import "../styles/dashboard.css";

const SellerDashboard = () => {

  const router = useNavigate();
  const [songs, setSongs] = useState([]);
  const [user, setUser] = useState(null);


  const fetchSongs = async () => {
    const res = await axios.get("http://localhost:3000/api/seller/my-songs", {
      withCredentials: true,
    });

    setSongs(res.data.songs);
  };

  const fetchUser = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/auth/me",
        { withCredentials: true }
      );
      setUser(res.data.user);
    } catch (err) {
      console.log("User fetch error", err);
    }
  };

  useEffect(() => {
    fetchSongs();
    fetchUser();
  }, []);

  const totalSongs = songs.length;
  const totalPlays = songs.reduce((sum, s) => sum + s.plays, 0);
  const totalLikes = songs.reduce((sum, s) => sum + s.likes, 0);

  const topLiked = songs.length
    ? [...songs].sort((a, b) => b.likes - a.likes)[0]
    : null;

  const topPlayed = songs.length
    ? [...songs].sort((a, b) => b.plays - a.plays)[0]
    : null;

  const recentSongs = [...songs]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // latest first
    .slice(0, 4); // only 4 most recent


  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/api/auth/logout",
        {},
        { withCredentials: true }
      );

      toast.success("Logged out!");
      router("/login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <SellerLayout>
      <div className="dash-layout">

        {user && (
          <div className="profile-card">
            <div className="profile-avatar">
              {user?.name?.charAt(0)}
            </div>

            <h2 className="profile-name">{user?.name}</h2>
            <p className="profile-email">{user?.email}</p>

            <p className="profile-joined">
              Joined: {new Date(user?.createdAt).toLocaleDateString()}
            </p>

            <div className="profile-links">
              <button onClick={() => router("/my-songs")}>🎵 Manage Songs</button>
              <button onClick={() => router("/upload-song")}>⬆ Upload Song</button>
              <button onClick={() => router("/profile")}>⚙ Edit Profile</button>
              <button onClick={() => router("/settings")}>🔧 Settings</button>
            </div>
          </div>
        )}

        <div className="dash-right">

          <h1 className="dash-title">Seller Dashboard</h1>

          <div className="dash-cards">
            <div className="dash-card">
              <h2>{totalSongs}</h2>
              <p>Total Songs</p>
            </div>

            <div className="dash-card">
              <h2>{totalPlays}</h2>
              <p>Total Plays</p>
            </div>

            <div className="dash-card">
              <h2>{totalLikes}</h2>
              <p>Total Likes</p>
            </div>
          </div>

          <div className="top-section">
            <div className="top-card">
              <h3>🔥 Most Played</h3>
              {topPlayed ? (
                <>
                  <img src={topPlayed.imageUrl} className="top-img" />
                  <p className="top-name">{topPlayed.title}</p>
                  <span className="top-count">{topPlayed.plays} plays</span>
                </>
              ) : (
                <p>No songs yet</p>
              )}
            </div>

            <div className="top-card">
              <h3>❤️ Most Liked</h3>
              {topLiked ? (
                <>
                  <img src={topLiked.imageUrl} className="top-img" />
                  <p className="top-name">{topLiked.title}</p>
                  <span className="top-count">{topLiked.likes} likes</span>
                </>
              ) : (
                <p>No songs yet</p>
              )}
            </div>
          </div>

          <h2 className="recent-title">Recent Uploads</h2>

          <div className="recent-wrapper">
            {recentSongs.map((song) => (
              <div className="recent-card" key={song._id}>
                <img src={song.imageUrl} className="recent-img" />
                <div>
                  <p className="recent-name">{song.title}</p>
                  <span className="recent-date">
                    {new Date(song.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="seller-buttons">
            <button
              onClick={() => router("/upload-song")}
              className="btn-upload"
            >
              Upload Song
            </button>

            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          </div>
        </div>
      </div>
    </SellerLayout>
  );

};

export default SellerDashboard;
