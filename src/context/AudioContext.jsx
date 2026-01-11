import { createContext, useRef, useState, useEffect } from "react";

export const AudioContext = createContext();

export default function AudioProvider({ children }) {
    const audioRef = useRef(new Audio());

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSong, setCurrentSong] = useState(null);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [playlist, setPlaylist] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const resetAudio = () => {
        const audio = audioRef.current;
        audio.pause();
        audio.currentTime = 0;
    };

    const togglePlay = async () => {
        const audio = audioRef.current;
        if (!audio.src) return;

        try {
            if (isPlaying) {
                audio.pause();
                setIsPlaying(false);
            } else {
                await audio.play();
                setIsPlaying(true);
            }
        } catch (err) {
            console.log("Toggle play blocked:", err.message);
        }
    };

    const playSong = async (song) => {
        if (!song?.audioUrl) return;

        if (currentSong?._id === song._id) {
            togglePlay();
            return;
        }

        try {
            const audio = audioRef.current;

            resetAudio(); // 🔥 IMPORTANT FIX
            audio.src = song.audioUrl;
            await audio.play();

            setCurrentSong(song);
            setIsPlaying(true);

            if (playlist.length > 0) {
                const index = playlist.findIndex(s => s._id === song._id);
                if (index !== -1) setCurrentIndex(index);
            }
        } catch (err) {
            console.log("PlaySong error:", err.message);
        }
    };

    const playPlaylist = async (songs, startIndex = 0) => {
        if (!songs?.length) return;

        try {
            const audio = audioRef.current;

            resetAudio(); // 🔥 FIX
            audio.src = songs[startIndex].audioUrl;
            await audio.play();

            setPlaylist(songs);
            setCurrentIndex(startIndex);
            setCurrentSong(songs[startIndex]);
            setIsPlaying(true);
        } catch (err) {
            console.log("Playlist play error:", err.message);
        }
    };

    const playNext = async () => {
        if (currentIndex + 1 >= playlist.length) {
            setIsPlaying(false);
            return;
        }

        try {
            const nextIndex = currentIndex + 1;
            const audio = audioRef.current;

            resetAudio(); // 🔥 FIX
            audio.src = playlist[nextIndex].audioUrl;
            await audio.play();

            setCurrentIndex(nextIndex);
            setCurrentSong(playlist[nextIndex]);
            setIsPlaying(true);
        } catch (err) {
            console.log("Next song error:", err.message);
        }
    };

    useEffect(() => {
        const audio = audioRef.current;

        const onLoadedMetadata = () => {
            setDuration(Math.floor(audio.duration || 0));
        };

        const onTimeUpdate = () => {
            setCurrentTime(Math.floor(audio.currentTime || 0));
        };

        const onEnded = () => {
            playNext();
        };

        audio.addEventListener("loadedmetadata", onLoadedMetadata);
        audio.addEventListener("timeupdate", onTimeUpdate);
        audio.addEventListener("ended", onEnded);

        return () => {
            audio.removeEventListener("loadedmetadata", onLoadedMetadata);
            audio.removeEventListener("timeupdate", onTimeUpdate);
            audio.removeEventListener("ended", onEnded);
        };
    }, [currentIndex, playlist]);

    return (
        <AudioContext.Provider
            value={{
                audioRef,
                isPlaying,
                currentSong,
                currentTime,
                duration,
                playSong,
                togglePlay,
                playlist,
                setPlaylist,
                playPlaylist,
                playNext
            }}
        >
            {children}
        </AudioContext.Provider>
    );
}