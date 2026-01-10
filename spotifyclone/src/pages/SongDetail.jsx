import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import player from "../player";
import "../styles/SongDetail.css";
import api from "../utils/axiosInstance";

export default function SongDetail() {
    const { id } = useParams();
    const [song, setSong] = useState(null);

    const [current, setCurrent] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        api.get(`/seller/get-song/${id}`)
            .then(res => setSong(res.data))
            .catch(err => console.log(err));
    }, [id]);

    useEffect(() => {
        if (song?.audioUrl) {
            player.load(song.audioUrl);
        }
    }, [song]);

    useEffect(() => {
        player.onStateChange((playing) => setIsPlaying(playing));
    }, []);

    useEffect(() => {
        player.onTimeUpdate((data) => {
            setCurrent(data.currentTime);
            setDuration(data.duration);
        });
    }, []);

    useEffect(() => {
        player.onSongEnd(() => {
            setIsPlaying(false);
            setCurrent(0);
        });
    }, []);

    if (!song) return <h2 className="loading">Loading...</h2>;

    return (
        <div className="songPage">

            <div className="songHeader">
                <img src={song.imageUrl} className="songImage" alt="" />

                <div className="songInfo">
                    <p className="songType">Song</p>
                    <h1 className="songTitle">{song.title}</h1>
                    <p className="songArtist">{song.uploadedBy?.name}</p>
                    <p className="songLikes">{song.likes} Likes</p>

                    <button
                        className="playBtn"
                        onClick={() => isPlaying ? player.pause() : player.play()}
                    >
                        {isPlaying ? "⏸ Pause" : "▶ Play"}
                    </button>
                </div>
            </div>

            <input
                type="range"
                min={0}
                max={duration}
                value={current}
                onChange={(e) => player.seek(e.target.value)}
                className="progressBar"
            />

            <div className="volumeBox">
                <p>Volume:</p>
                <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={player.volume}
                    onChange={(e) => player.setVolume(e.target.value)}
                    className="volumeSlider"
                />
            </div>
        </div>
    );
}
