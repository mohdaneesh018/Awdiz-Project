import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";

const AdminDashboard = () => {
    const [songs, setSongs] = useState([]);
    const [artists, setArtists] = useState([]);
    const [sellers, setSellers] = useState([]);
    const [activeTab, setActiveTab] = useState("songs");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const songRes = await axios.get(
            "http://localhost:3000/api/admin/songs",
            { withCredentials: true }
        );
        const artistRes = await axios.get(
            "http://localhost:3000/api/admin/artists",
            { withCredentials: true }
        );
        const sellerRes = await axios.get(
            "http://localhost:3000/api/admin/sellers",
            { withCredentials: true }
        );

        setSongs(songRes.data);
        setArtists(artistRes.data);
        setSellers(sellerRes.data);
    };

    const deleteSong = async (id) => {
        await axios.delete(
            `http://localhost:3000/api/admin/song/${id}`,
            { withCredentials: true }
        );
        fetchData();
    };

    const deleteArtist = async (id) => {
        await axios.delete(
            `http://localhost:3000/api/admin/artist/${id}`,
            { withCredentials: true }
        );
        fetchData();
    };

    const deleteSeller = async (id) => {
        await axios.delete(
            `http://localhost:3000/api/admin/seller/${id}`,
            { withCredentials: true }
        );
        fetchData();
    };

    return (
        <div className="admin-layout"> 
            <div className="admin-sidebar">
                <h2>Admin</h2>

                <button
                    className={activeTab === "songs" ? "active" : ""}
                    onClick={() => setActiveTab("songs")}
                >
                    Songs
                </button>

                <button
                    className={activeTab === "artists" ? "active" : ""}
                    onClick={() => setActiveTab("artists")}
                >
                    Artists
                </button>

                <button
                    className={activeTab === "sellers" ? "active" : ""}
                    onClick={() => setActiveTab("sellers")}
                >
                    Sellers
                </button>
            </div>
 
            <div className="admin-content">
                {activeTab === "songs" && (
                    <div className="content-box">
                        <h2>Songs</h2>
                        {songs.map((song) => (
                            <div className="row" key={song._id}>
                                <span>{song.title}</span>
                                <button onClick={() => deleteSong(song._id)}>Delete</button>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === "artists" && (
                    <div className="content-box">
                        <h2>Artists</h2>
                        {artists.map((artist) => (
                            <div className="row" key={artist._id}>
                                <span>{artist.name}</span>
                                <button onClick={() => deleteArtist(artist._id)}>Delete</button>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === "sellers" && (
                    <div className="content-box">
                        <h2>Sellers</h2>
                        {sellers.map((seller) => (
                            <div className="row" key={seller._id}>
                                <span>{seller.name || seller.email}</span>
                                <button onClick={() => deleteSeller(seller._id)}>Delete</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
