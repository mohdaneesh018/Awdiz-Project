import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "../styles/addToPlaylistModal.css";

export default function AddToPlaylistModal({
    playlistId,
    onClose,
    refreshPlaylist
}) {
    const [songs, setSongs] = useState([]);
    const [playlistSongs, setPlaylistSongs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get("http://localhost:3000/api/songs/get-songs")
            .then(res => setSongs(res.data));

        axios
            .get(`http://localhost:3000/api/playlists/${playlistId}`)
            .then(res => {
                const ids = res.data.songs.map(song => song._id);
                setPlaylistSongs(ids);
            });
    }, [playlistId]);

    const addSong = async (songId) => {
        try {
            await axios.post(
                `http://localhost:3000/api/playlists/${playlistId}/add/${songId}`
            );

            toast.success("Song added to playlist");

            setPlaylistSongs(prev => [...prev, songId]);

            refreshPlaylist();
            onClose();
            navigate(`/playlist/${playlistId}`, { replace: true });
        } catch (err) {
            toast.error("Failed to add song");
        }
    };

    return (
        <div className="modalOverlay">
            <div className="modalBox">
                <h3>Add song to playlist</h3>

                {songs.map(song => {
                    const alreadyAdded = playlistSongs.includes(song._id);

                    return (
                        <div
                            key={song._id}
                            className={`playlistOption ${alreadyAdded ? "disabled" : ""}`}
                            onClick={() => {
                                if (!alreadyAdded) addSong(song._id);
                            }}
                        >
                            🎵 {song.title}
                            {alreadyAdded && " ✓ Added"}
                        </div>
                    );
                })}

                <button className="cancelBtn" onClick={onClose}>
                    Cancel
                </button>
            </div>
        </div>
    );
}
