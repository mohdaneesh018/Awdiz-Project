import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react"; 
import "../styles/Radio.css";
import { AudioContext } from "../context/AudioContext";
import api from "../utils/AxiosInstance";

export default function Radio() {
    const { sellerId } = useParams();
    const [radioData, setRadioData] = useState(null);

    const {
        playSong,
        setPlaylist,
        currentSong,
        isPlaying
    } = useContext(AudioContext);

    useEffect(() => {
        api
            .get(`/songs/radio/${sellerId}`)
            .then((res) => {
                setRadioData(res.data);
                setPlaylist([]);
                playSong(res.data.topSong);
            })
            .catch((err) => console.log(err));
    }, [sellerId]);

    if (!radioData) return <p>Loading...</p>;

    return (
        <div className="radioPage">
            <div className="radioHeader">
                <img
                    src={radioData.topSong.imageUrl}
                    alt=""
                    className="radioImage"
                />

                <div className="radioInfo">
                    <p>Radio</p>
                    <h2>{radioData.seller.name}</h2>
                    <p>{radioData.topSong.likes} Likes</p>
                </div>
            </div>

            <h3 className="radioSongTitle">
                {radioData.topSong.title}
            </h3>

            <p className="radioLikes">
                ❤️ {radioData.topSong.likes} Likes
            </p>
        </div>
    );
}
