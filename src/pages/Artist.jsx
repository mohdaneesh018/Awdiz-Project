import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react"; 
import { AudioContext } from "../context/AudioContext";
import "../styles/Artist.css";
import api from "../utils/axiosInstance";

export default function Artist() {
    const { id } = useParams();
    const [artist, setArtist] = useState(null);
    const [loading, setLoading] = useState(true);

    const { playSong, currentSong } = useContext(AudioContext);

    const formatTime = (sec) => {
        if (sec === null || sec === undefined || isNaN(sec)) return "--:--";
        const min = Math.floor(sec / 60);
        const seconds = Math.floor(sec % 60);
        return `${min}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    useEffect(() => {
        setLoading(true);
        api
            .get(`/artists/${id}`)
            .then(res => {
                setArtist(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setArtist(null);
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return <p style={{ color: "white", padding: 24 }}>Loading...</p>;
    }

    if (!artist) {
        return <p style={{ color: "white", padding: 24 }}>Artist not found</p>;
    }

    return (
        <div className="artist-page">

            <div className="artist-header">
                <img
                    src={artist.image}
                    alt={artist.name}
                    className="artist-header-image"
                />

                <div className="artist-header-info">
                    <span className="artist-label">ARTIST</span>
                    <h1 className="artist-name">{artist.name}</h1>
                    <span className="artist-meta">
                        {artist.songs.length} songs
                    </span>
                </div>
            </div>

            {artist.songs.length > 0 && (
                <div className="artist-controls">
                    <div
                        className="artist-play-btn"
                        onClick={() => playSong(artist.songs[0])}
                    >
                        <img src="/images/play_arrow_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg" />
                    </div>
                </div>
            )}

            <div className="artist-songs">
                <h2>Popular</h2>

                <div className="artist-song-header">
                    <span className="col-index">#</span>
                    <span className="col-title">Title</span>
                    <span className="col-duration">⏱</span>
                </div>

                {artist.songs.map((song, index) => {
                    const isActive = currentSong?._id === song._id;

                    return (
                        <div
                            key={song._id}
                            className={`artist-song-row ${isActive ? "active-song" : ""}`}
                            onClick={() => playSong(song)}
                        >
                            <span className="col-index">{index + 1}.</span>

                            <span className="col-title">{song.title}</span>

                            <span className="col-duration">
                                {formatTime(song.duration)}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
