import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react"; 
import { AudioContext } from "../context/AudioContext";
import "../styles/Seller.css"
import api from "../utils/axiosInstance";

export default function Seller() {
    const { sellerId } = useParams();
    const [songs, setSongs] = useState([]);
    const [sellerName, setSellerName] = useState("");
    const { playSong, setPlaylist, currentSong } = useContext(AudioContext);

    const playSellerSongs = (songs, index = 0) => {
        setPlaylist(songs);
        playSong(songs[index]);
    };

    const formatDuration = (seconds) => {
        if (!seconds && seconds !== 0) return "0:00";
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${min}:${sec < 10 ? "0" : ""}${sec}`;
    };

    useEffect(() => {
        api
            .get(`/songs/seller/${sellerId}`)
            .then(res => {
                setSongs(res.data.songs);
                setSellerName(res.data.sellerName);
            })
            .catch(err => console.log(err));
    }, [sellerId]);

    if (!songs.length) return null;

    return (
        <>
            <div id="artistPage">
                <div id="artistTop">
                    <img
                        src={songs[0].imageUrl}
                        alt="seller"
                        className="artistImg"
                    />

                    <div className="artistInfo">
                        <span>SELLER</span>
                        <h1>{sellerName}</h1>
                        <p>{songs.length} songs</p>
                    </div>
                </div>

                <button
                    className="playBig"
                    onClick={() => playSellerSongs(songs, 0)}
                >
                    ▶
                </button>

                <div className="artistSongs">
                    {songs.map((song, index) => (
                        <div
                            className={`songRow ${currentSong?._id === song._id ? "activeSong" : ""
                                }`}
                            key={song._id}
                            onClick={() => playSellerSongs(songs, index)}
                        >

                            <span>{index + 1}.</span>
                            <span>{song.title}</span>
                            <span>{formatDuration(song.duration)}</span>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
