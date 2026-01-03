import { useContext } from "react";
import { AudioContext } from "../context/AudioContext";
import "../styles/GlobalPlayer.css";

export default function GlobalPlayer() {
    const { currentSong, isPlaying, togglePlay } = useContext(AudioContext);

    if (!currentSong) return null;

    return (
        <div className="global-player">
            <img src={currentSong.imageUrl} className="gp-img" />

            <div className="gp-info">
                <p className="gp-title">{currentSong.title}</p>
                <p className="gp-artist">{currentSong.artist}</p>
            </div>

            <button className="gp-play" onClick={togglePlay}>
                {isPlaying ? "⏸" : "▶"}
            </button>
        </div>
    );
}