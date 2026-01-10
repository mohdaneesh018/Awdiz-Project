import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react"; 
import "../styles/playlist.css";
import AddToPlaylistModal from "../components/AddToPlaylistModal";
import { AudioContext } from "../context/AudioContext";
import toast from "react-hot-toast";
import api from "../utils/AxiosInstance";

const formatDuration = (seconds) => {
    if (!seconds) return "0:00";

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

export default function Playlist() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [playlist, setPlaylist] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);

    const {
        playSong,
        togglePlay,
        isPlaying,
        currentSong,
        setPlaylist: setGlobalPlaylist
    } = useContext(AudioContext);

    const fetchPlaylist = async () => {
        try {
            const res = await api.get(
                `/playlists/${id}`
            );
            setPlaylist(res.data);
        } catch (err) {
            if (err.response?.status === 404) {
                navigate("/");
            } else {
                console.log(err);
            }
        }
    };

    const removePlaylistSong = async (songId) => {
        try {
            await api.delete(
                `/playlists/${playlist._id}/remove/${songId}`
            );

            toast.success("Song removed from playlist");
            fetchPlaylist();
        } catch (err) {
            toast.error("Failed to remove song");
        }
    };

    useEffect(() => {
        fetchPlaylist();
    }, [id]);

    if (!playlist) return <p>Loading...</p>;

    return (
        <div className="playlistPage">
            <h1>{playlist.name}</h1>

            <button
                className="playlistPlayBtn"
                onClick={() => {
                    if (playlist.songs.length === 0) return;

                    setGlobalPlaylist(playlist.songs);

                    if (currentSong?._id === playlist.songs[0]._id) {
                        togglePlay();
                    } else {
                        playSong(playlist.songs[0]);
                    }
                }}
            >
                {isPlaying ? "⏸ Pause" : "▶ Play"}
            </button>

            <p>{playlist.songs.length} songs</p>

            <button
                className="addSongBtn"
                onClick={() => setShowAddModal(true)}
            >
                ➕ Add Songs
            </button>

            {playlist.songs.length === 0 ? (
                <div className="emptyPlaylist">
                    <p>This playlist is empty</p>
                    <button onClick={() => setShowAddModal(true)}>
                        Add Songs
                    </button>
                </div>
            ) : (
                playlist.songs.map((song, index) => {
                    const isActive = currentSong?._id === song._id;

                    return (
                        <div
                            key={song._id}
                            className={`songRows ${isActive ? "activeSong" : ""}`}
                            onClick={() => {
                                setGlobalPlaylist(playlist.songs);
                                playSong(song);
                            }}
                        >
                            <span>{index + 1}.</span>

                            <span className="songTitle">
                                {song.title}
                            </span>

                            <span className="songDuration">
                                {formatDuration(song.duration)}
                            </span>

                            <span
                                className="deleteSong"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removePlaylistSong(song._id);
                                }}
                            >
                                ❌
                            </span>
                        </div>
                    );
                })
            )}

            {showAddModal && (
                <AddToPlaylistModal
                    playlistId={playlist._id}
                    onClose={() => setShowAddModal(false)}
                    refreshPlaylist={fetchPlaylist}
                />
            )}
        </div>
    );
}
