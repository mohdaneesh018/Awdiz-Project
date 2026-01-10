import { useEffect, useRef, useState } from "react"; 
import SellerLayout from "../pages/SellerLayout";
import "../styles/MySongs.css";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../utils/AxiosInstance";

const MySongs = () => {
  const [songs, setSongs] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  const audioRefs = useRef({});
  const navigate = useNavigate();

  const fetchSongs = async () => {
    try {
      const res = await api.get("/seller/my-songs", {
        withCredentials: true,
      });
      setSongs(res.data.songs);
    } catch (err) {
      console.log("Error fetching songs", err);
    }
  };

  const likeSong = async (id) => {
    try {
      await api.put(
        `/songs/like/${id}`
      );
      fetchSongs();
    } catch (err) {
      console.log(err);
    }
  };


  useEffect(() => {
    fetchSongs();
  }, []);

  const deleteSong = async (id) => {
    try {
      await api.delete(`/seller/delete-song/${id}`, {
        withCredentials: true,
      });
      toast.success("Song deleted");
      fetchSongs();
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  const handlePlay = (currentId) => {
    Object.keys(audioRefs.current).forEach((id) => {
      if (id !== currentId) {
        const audio = audioRefs.current[id];
        if (audio && !audio.paused) {
          audio.pause();
          audio.currentTime = 0;
        }
      }
    });
  };

  const filteredSongs = songs
    .filter((s) => s.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "latest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "oldest")
        return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === "az") return a.title.localeCompare(b.title);
      if (sortBy === "za") return b.title.localeCompare(a.title);
      return 0;
    });

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <SellerLayout>
      <div className="mysongs-header">
        <h1 className="mysongs-title">My Songs</h1>

        <div className="mysongs-tools">
          <input
            type="text"
            placeholder="Search songs..."
            className="mysongs-search"
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="mysongs-sort"
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="latest">Latest First</option>
            <option value="oldest">Oldest First</option>
            <option value="az">A → Z</option>
            <option value="za">Z → A</option>
          </select>
        </div>
      </div>

      <table className="songs-table">
        <thead>
          <tr>
            <th>Cover</th>
            <th>Title</th>
            <th>Audio</th>
            <th>Uploaded</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredSongs.map((song) => (
            <tr key={song._id}>
              <td>
                {song.imageUrl ? (
                  <img src={song.imageUrl} alt="cover" className="song-cover" />
                ) : (
                  "No Image"
                )}
              </td>

              <td className="song-title">{song.title}</td>

              <td className="audio-play">
                <audio
                  controls
                  ref={(el) => (audioRefs.current[song._id] = el)}
                  onPlay={() => {
                    handlePlay(song._id);
                    api.put(
                      `/seller/increase-play/${song._id}`,
                      {},
                      { withCredentials: true }
                    );
                  }}
                  src={
                    song.audioUrl?.startsWith("http")
                      ? song.audioUrl
                      : `http://localhost:3000${song.audioUrl}`
                  }
                  className="song-audio"
                />
              </td>

              <td className="song-date">{formatDate(song.createdAt)}</td>

              <td className="song-actions">
                <button className="like-btn" onClick={() => likeSong(song._id)}>
                  ❤️ {song.likes}
                </button>

                <button
                  className="edit-btn"
                  onClick={() => navigate(`/edit-song/${song._id}`)}
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => deleteSong(song._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </SellerLayout>
  );
};

export default MySongs;
