import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react"; 
import "../styles/style.css";
import AddToPlaylistModal from "../components/AddToPlaylistModal";
import api from "../utils/axiosInstance";

export default function Home() {
    const [songs, setSongs] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [radio, setRadio] = useState([]);
    const [query, setQuery] = useState("");
    const [allSongs, setAllSongs] = useState([]);
    const [results, setResults] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedSong, setSelectedSong] = useState(null);

    const navigate = useNavigate();

    const getTopPopularAlbums = () => {
        if (!albums || albums.length === 0) return [];

        const sorted = [...albums].sort(
            (a, b) => b.count - a.count
        );

        return sorted.slice(0, 3);
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        setQuery(value);

        if (!value.trim()) {
            setResults([]);
            return;
        }

        const filtered = allSongs.filter(song =>
            song.title.toLowerCase().includes(value.toLowerCase())
        );

        setResults(filtered.slice(0, 6));
    };

    const createPlaylist = async () => {
        const name = prompt("Enter playlist name");
        if (!name) return;

        const res = await api.post(
            "/playlists/create",
            { name }
        );

        setPlaylists([...playlists, res.data]);
    };

    const deletePlaylist = async (playlistId) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this playlist?"
        );

        if (!confirmDelete) return;

        try {
            await api.delete(
                `/playlists/delete/${playlistId}`
            );

            setPlaylists(prev =>
                prev.filter(p => p._id !== playlistId)
            );
        } catch (error) {
            console.error("Delete failed", error);
        }
    };

    useEffect(() => {
        api.get("/songs/get-songs")
            .then(res => {
                setSongs(res.data);
                setAllSongs(res.data);
            })
            .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        api.get("/songs/get-albums")
            .then(res => setAlbums(res.data))
            .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        api.get("/songs/popular-radio")
            .then(res => setRadio(res.data))
            .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        api.get("/playlists")
            .then(res => setPlaylists(res.data))
            .catch(err => console.log(err));
    }, []);


    useEffect(() => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        const fetchSongs = async () => {
            try {
                const res = await api.get(
                    "/songs/get-songs"
                );

                const filtered = res.data.filter(song =>
                    song.title.toLowerCase().includes(query.toLowerCase())
                );

                setSearchResults(filtered);
                console.log("Search result:", filtered);
            } catch (err) {
                console.error(err);
            }
        };

        fetchSongs();
    }, [query]);

    return (
        <>
            <div id="screen">
                <div class="header">
                    <div id="headerLeft">
                        <div id="headerSection1">
                            <img src="/images/icons8-spotify-50.png" alt="" />
                        </div>

                        <div id="headerSection2">
                            <img
                                src="/images/home_24dp_F3F3F3_FILL0_wght400_GRAD0_opsz24.svg"
                                alt=""
                            />
                        </div>

                        <div id="searchBars">
                            <div className="searchs1">
                                <img src="/images/icons8-search-50.png" alt="" />
                            </div>

                            <div className="searchs2">
                                <input
                                    type="text"
                                    placeholder="What you want to play ?"
                                    value={query}
                                    onChange={handleSearch}
                                />
                                {searchResults.length > 0 && (
                                    <div className="search-results">
                                        {searchResults.map(song => (
                                            <div
                                                key={song._id}
                                                className="search-item"
                                                onClick={() => {
                                                    navigate(`/cart/${song._id}`);
                                                    setSearchResults([]);
                                                    setQuery("");
                                                }}
                                            >
                                                <img src={song.imageUrl} alt="" />
                                                <div>
                                                    <p>{song.title}</p>
                                                    <small>{song.sellerId?.name || "Unknown Artist"}</small>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="wishlistBags">
                                <img
                                    src="/images/icons8-bag-64.png"
                                    alt=""
                                />
                            </div>
                        </div>

                        <div className="mobsearch">
                            <img src="/images/icons8-search-50.png" alt="" />
                        </div>
                    </div>

                    <div id="headerRight">
                        <div id="headerPrem">
                            <a>Premium</a>
                            <a>Support</a>
                            <a>Download</a>
                        </div>

                        <div id="headerInst">
                            <img
                                src="/images/download_for_offline_24dp_EFEFEF_FILL0_wght400_GRAD0_opsz24.svg"
                                alt=""
                            />
                            <a>Install App</a>
                        </div>

                        <div id="headerLog">
                            <Link className="regs" to="/register">Sign up</Link>
                            <Link to="/login">
                                <button>Log in</button>
                            </Link>
                        </div>
                    </div>
                </div>

                <div id="body">
                    <div id="bodyLeft">
                        <header>
                            <div id="bodyLeftTop">
                                <h4>Your Library</h4>
                                <button>
                                    <img
                                        src="/images/add_2_24dp_EFEFEF_FILL0_wght400_GRAD0_opsz24.svg"
                                        alt=""
                                    />
                                </button>
                            </div>
                        </header>

                        <div id="bodyLeftMiddle">
                            <div className="playlistList">
                                {playlists.map((playlist) => (
                                    <div className="playlistItem"
                                        key={playlist._id}
                                        onClick={() => navigate(`/playlist/${playlist._id}`)}
                                    >
                                        <span>{playlist.name}</span>
                                        <span
                                            className="deleteIcon"
                                            onClick={() => deletePlaylist(playlist._id)}
                                        >
                                            ✖
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div>
                                <section id="section1">
                                    <div id="createMiddle">
                                        <h4>Create your first playlist</h4>
                                        <br />
                                        <p>It's easy, we'll help you</p>
                                    </div>
                                    <button
                                        id="addBtn"
                                        onClick={createPlaylist}
                                    >
                                        Create Playlist
                                    </button>
                                </section>
                            </div>

                            <div>
                                <section id="section2">
                                    <div id="createMiddle2">
                                        <h4>Let's find some podcasts to follow</h4>
                                        <br />
                                        <p>We'll keep you updated on new episodes</p>
                                    </div>
                                    <button id="addBtn2">Browse Podcasts</button>
                                </section>
                            </div>

                        </div>

                        <div id="bodyLeftBottom">
                            <div id="bodyLeftBottom1">
                                <div>Legal</div>
                                <div>Safety & Privacy Center</div>
                                <div>Privacy Policy</div>
                                <div>Cookies</div>
                                <div>About Ads</div>
                                <div>Accessibility</div>
                            </div>
                            <p>Cookies</p>
                        </div>
                        <button id="addButton">
                            <img
                                src="/images/language_24dp_EFEFEF_FILL0_wght400_GRAD0_opsz24.svg"
                                alt=""
                            />
                            <span>English</span>
                        </button>
                    </div>

                    <div id="bodyRight">
                        <div className="bodyRightTop">
                            <div className="bodyRightTop1">
                                <a className="bodyRightTop1Child">
                                    <h2>Trending Songs</h2>
                                </a>
                            </div>
                            <a className="showAll">
                                <span>Show All</span>
                            </a>
                        </div>

                        <div className="bodyRightMiddle">
                            {songs.map((item) => (
                                <div className="songCard" key={item._id}>
                                    <img
                                        src={item.imageUrl}
                                        alt={item.title}
                                        onClick={() => navigate(`/cart/${item._id}`)}
                                    />
                                    <div className="songText">
                                        <p className="songName">{item.title}</p>
                                        <p className="actName">{item.uploadedBy?.name}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="sectionHeader">
                            <div className="sectionTitle">
                                <h2>Popular Artists</h2>
                            </div>

                            <a className="showAllBtn">
                                <span>Show All</span>
                            </a>
                        </div>

                        <div className="artistsRow">
                            <div className="artistCard" onClick={() => navigate("/artist/pritam")}>
                                <img src="/images/ab67616100005174cb6926f44f620555ba444fca.jpeg" alt="" />
                                <div className="artistText">
                                    <p className="artistName">Pritam</p>
                                    <p className="artistRole">Artist</p>
                                </div>
                            </div>

                            <div className="artistCard" onClick={() => navigate("/artist/ar-rahman")}>
                                <img src="/images/ab67616100005174b19af0ea736c6228d6eb539c.jpeg" alt="" />
                                <div className="artistText">
                                    <p className="artistName">A. R. Rahman</p>
                                    <p className="artistRole">Artist</p>
                                </div>
                            </div>

                            <div className="artistCard" onClick={() => navigate("/artist/arijit-singh")}>
                                <img src="/images/ab676161000051745ba2d75eb08a2d672f9b69b7.jpeg" alt="" />
                                <div className="artistText">
                                    <p className="artistName">Arijit Singh</p>
                                    <p className="artistRole">Artist</p>
                                </div>
                            </div>

                            <div className="artistCard" onClick={() => navigate("/artist/sachin-jigar")}>
                                <img src="/images/ab67616100005174bb4064bef3a825344d5eb79e.jpeg" alt="" />
                                <div className="artistText">
                                    <p className="artistName">Sachin Jigar</p>
                                    <p className="artistRole">Artist</p>
                                </div>
                            </div>

                            <div className="artistCard" onClick={() => navigate("/artist/atif-aslam")}>
                                <img src="/images/ab67616100005174c40600e02356cc86f0debe84.jpeg" alt="" />
                                <div className="artistText">
                                    <p className="artistName">Atif Aslam</p>
                                    <p className="artistRole">Artist</p>
                                </div>
                            </div>

                            <div className="artistCard" onClick={() => navigate("/artist/honey-singh")}>
                                <img src="/images/ab67616100005174bc7e4fffd515b47ff1ebbc1f.jpeg" alt="" />
                                <div className="artistText">
                                    <p className="artistName">Yo Yo Honey Singh</p>
                                    <p className="artistRole">Artist</p>
                                </div>
                            </div>

                            <div className="artistCard" onClick={() => navigate("/artist/anirudh-ravichander")}>
                                <img src="/images/ab676161000051740f0be2054fe9594026a6b843.jpeg" alt="" />
                                <div className="artistText">
                                    <p className="artistName">Anirudh Ravichander</p>
                                    <p className="artistRole">Artist</p>
                                </div>
                            </div>
                        </div>

                        <div id="PopularAlbum">
                            <div id="PopularAlbum1">
                                <a id="PopularAlbum2"><h2>Popular albums</h2></a>
                            </div>
                            <a id="showAll3"><span>Show All</span></a>
                        </div>

                        <div id="bodyRightMiddle3">
                            {getTopPopularAlbums().map((album, index) => (
                                <div className="albumCard"
                                    key={index}
                                    onClick={() => navigate(`/seller/${album._id}`)}
                                >
                                    <img
                                        src={album.songs?.[0]?.imageUrl || "/default.jpg"}
                                        alt="album"
                                    />

                                    <div className="albumText">
                                        <p className="albumName">
                                            {album.sellerName}
                                        </p>

                                        <p className="albumCount">
                                            {album.count} Songs
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="PopularRadio">
                            <div className="PopularRadio1">
                                <a className="PopularRadio2"><h2>Popular Radio</h2></a>
                            </div>
                            <a className="showAll4"><span>Show All</span></a>
                        </div>

                        <div className="bodyRightMiddle4">
                            {radio.map((item, index) => (
                                <div
                                    className="radioCard"
                                    key={index}
                                    onClick={() => navigate(`/radio/${item._id}`)}
                                >
                                    <img src={item.topSong.imageUrl} alt="" />

                                    <div className="radioText">
                                        <p className="radioName">
                                            {item.seller.name}
                                            <br />
                                            Radio • {item.topSong.likes} Likes
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <hr />

                        <div className="navbar">
                            <div className="mainNavbar">
                                <div className="navbar1">
                                    <h3>Company</h3>
                                    <br />
                                    <p>About</p>
                                    <br />
                                    <p>Jobs</p>
                                    <br />
                                    <p>For the Record</p>
                                </div>

                                <div className="navbar2">
                                    <h3>Communities</h3>
                                    <br />
                                    <p>For Artists</p>
                                    <br />
                                    <p>Developers</p>
                                    <br />
                                    <p>Advertising</p>
                                    <br />
                                    <p>Investors</p>
                                    <br />
                                    <p>Vendors</p>
                                </div>

                                <div className="navbar3">
                                    <h3>Useful links</h3>
                                    <br />
                                    <p>Support</p>
                                    <br />
                                    <p>Free Mobile App</p>
                                    <br />
                                    <p>Popular by Country</p>
                                </div>

                                <div className="navbar4">
                                    <h3>Spotify Plans</h3>
                                    <br />
                                    <p>Premium Individual</p>
                                    <br />
                                    <p>Premium Duo</p>
                                    <br />
                                    <p>Premium Family</p>
                                    <br />
                                    <p>Premium Student</p>
                                    <br />
                                    <p>Spotify Free</p>
                                </div>

                                <div id="icons">
                                    <div id="icon-container">
                                        <a href="https://instagram.com/yourprofile" target="_blank">
                                            <i class="fa-brands fa-instagram"></i>
                                        </a>
                                        <a href="https://twitter.com/yourprofile" target="_blank">
                                            <i class="fa-brands fa-twitter"></i>
                                        </a>
                                        <a href="https://facebook.com/yourprofile" target="_blank">
                                            <i class="fa-brands fa-facebook"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="copyRight">
                            <p>© 2025 Spotify AB</p>
                        </div>
                    </div>
                </div>
                {showAddModal && (
                    <AddToPlaylistModal
                        song={selectedSong}
                        playlists={playlists}
                        onClose={() => setShowAddModal(false)}
                    />
                )}
            </div>
        </>
    );
}