import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function SearchResults() {
    const { query } = useParams();
    const [songs, setSongs] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:3000/api/songs")
            .then(res => {
                const filtered = res.data.filter(song =>
                    song.title.toLowerCase().includes(query.toLowerCase())
                );
                setSongs(filtered);
            });
    }, [query]);

    return (
        <div style={{ paddingTop: "90px", color: "white" }}>
            <h2>Search results for "{query}"</h2>

            {songs.map(song => (
                <p key={song._id}>{song.title}</p>
            ))}
        </div>
    );
}
