import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Cart.css";
import axios from "axios";
import { AudioContext } from "../context/AudioContext";

export default function Cart() {
    const { id } = useParams();
    const [song, setSong] = useState(null);
    const audioRef = useRef(null);
    const [allSongs, setAllSongs] = useState([]);
    const [randomSongs, setRandomSongs] = useState([]);
    const [headerLiked, setHeaderLiked] = useState(false);
    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [results, setResults] = useState([]);
    const [playlists, setPlaylists] = useState([]);

    const { playSong, togglePlay, currentSong, isPlaying } = useContext(AudioContext);

    const rightRef = useRef(null);
    const navigate = useNavigate();

    const isThisSongPlaying =
        currentSong?._id === song?._id && isPlaying;

    const handlePlayPause = () => {
        if (!song) return;

        if (!currentSong || currentSong?._id !== song._id) {
            playSong(song);
        }
        else {
            togglePlay();
        }
    };

    const handleHeaderLike = async () => {
        try {
            const res = await axios.put(
                `http://localhost:3000/api/songs/like/${song._id}`
            );

            setSong(prev => ({
                ...prev,
                likes: res.data.likes
            }));

            setHeaderLiked(true);
        } catch (err) {
            console.error("Header like error", err);
        }
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

        const res = await axios.post(
            "http://localhost:3000/api/playlists/create",
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
            await axios.delete(
                `http://localhost:3000/api/playlists/delete/${playlistId}`
            );

            setPlaylists(prev =>
                prev.filter(p => p._id !== playlistId)
            );
        } catch (error) {
            console.error("Delete failed", error);
        }
    };

    const formatTime = (sec) => {
        if (sec === null || sec === undefined || isNaN(sec)) return "--:--";
        const min = Math.floor(sec / 60);
        const seconds = Math.floor(sec % 60);
        return `${min}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    useEffect(() => {
        if (!id) return;

        const fetchSong = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/api/songs/${id}`);
                const data = res.data;
                setSong(data);
                setHeaderLiked(false);
            } catch (err) {
                console.error("Failed to load song:", err);
                setSong(null);
            }
        };

        fetchSong();
    }, [id]);

    useEffect(() => {
        const fetchAllSongs = async () => {
            try {
                const res = await axios.get("http://localhost:3000/api/songs/get-songs");
                setAllSongs(res.data);
            } catch (err) {
                console.error("Failed to fetch all songs", err);
            }
        };
        fetchAllSongs();
    }, []);

    useEffect(() => {
        if (allSongs.length > 0) {
            const shuffled = [...allSongs].sort(() => 0.5 - Math.random());
            setRandomSongs(shuffled.slice(0, 7));
        }
    }, [allSongs, id]);

    useEffect(() => {
        if (rightRef.current) {
            rightRef.current.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        }
    }, [id]);

    useEffect(() => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        const fetchSongs = async () => {
            try {
                const res = await axios.get(
                    "http://localhost:3000/api/songs/get-songs"
                );

                const filtered = res.data.filter(song =>
                    song.title.toLowerCase().includes(query.toLowerCase())
                );

                setSearchResults(filtered);
            } catch (err) {
                console.error(err);
            }
        };

        fetchSongs();
    }, [query]);

    if (!song) {
        return <h1 style={{ color: "white", padding: 24 }}>Loading...</h1>;
    }

    const artists = song.artist ? song.artist.split(",").map((a) => a.trim()) : [];


    return (
        <>
            <div id="screen">
                <audio ref={audioRef} />

                <div className="header">
                    <div className="headerLeft">
                        <div className="headerSection1">
                            <img src="/images/icons8-spotify-50.png" alt="" />
                        </div>

                        <div className="headerSection2">
                            <button>
                                <img
                                    src="/images/home_24dp_F3F3F3_FILL0_wght400_GRAD0_opsz24.svg"
                                    alt=""
                                />
                            </button>

                            <div className="SearchBar">
                                <div className="search1">
                                    <img src="/images/icons8-search-50.png" alt="" />
                                </div>

                                <div className="search2">
                                    <input
                                        type="text"
                                        placeholder="What you want to play?"
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
                                                        <small>
                                                            {song.sellerId?.name || "Unknown Artist"}
                                                        </small>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="wishlistBag">
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
                    </div>

                    <div id="headerRight">
                        <div className="headerPrem">
                            <a>Premium</a>
                            <a>Support</a>
                            <a>Download</a>
                        </div>

                        <div className="headerInst">
                            <img
                                src="/images/download_for_offline_24dp_EFEFEF_FILL0_wght400_GRAD0_opsz24.svg"
                                alt=""
                            />
                            <a>Install App</a>
                        </div>

                        <div className="headerLog">
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
                                <h1>Your Library</h1>
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

                    <main className="body-right" ref={rightRef}>
                        <div className="body-right-top">
                            <img src={song.imageUrl} alt={song.title} className="cover-img" />

                            <div className="info">
                                <span className="type">Single</span>
                                <h1 className="title">{song.title}</h1>

                                {artists.map((a, i) => (
                                    <a className="artist" key={i}>
                                        {a}.
                                    </a>
                                ))}

                                <div className="meta">
                                    <span className="year">{song.year || "2025"}.</span>
                                    <span className="count">1 song.</span>
                                    <span className="duration">
                                        {formatTime(song.duration)}
                                    </span>
                                </div>
                                <div className="header-like">
                                    <span
                                        className={`header-like-btn ${headerLiked ? "liked" : ""}`}
                                        onClick={handleHeaderLike}
                                        title="Like"
                                    >
                                        ❤️
                                    </span>
                                    <span className="header-like-count">
                                        {song.likes}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="controls">
                            <div className="play-btn" onClick={handlePlayPause} role="button" tabIndex={0}>
                                <img
                                    src={
                                        isThisSongPlaying
                                            ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTF7kOM8fZsyOx91_BuLHp7OAe15ko7kUHm2w&s"
                                            : "/images/play_arrow_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
                                    }
                                    alt="play"
                                />

                            </div>

                            <div className="add-btn">
                                <img src="/images/add_circle_24dp_EFEFEF_FILL0_wght400_GRAD0_opsz24.svg" alt="add" />
                            </div>

                            <button className="list-btn">
                                <span>List</span>
                                <img src="/images/format_list_bulleted_24dp_B3B3B3_FILL0_wght400_GRAD0_opsz24.svg" alt="list" />
                            </button>
                        </div>

                        <div className="song-row-head">
                            <span className="col-num">#</span>
                            <span className="col-title">Title</span>
                            <img src="/images/clock_loader_20_24dp_B7B7B7_FILL0_wght400_GRAD0_opsz24.svg" alt="time" />
                        </div>

                        <hr className="divider" />

                        <div className="song-row">
                            <span className="num">1.</span>
                            <div className="song-details">
                                <h4 className="song-title">{song.title}</h4>
                                <a className="song-artist">{song.artist}</a>

                                <span className="duration">
                                    {formatTime(song.duration)}
                                </span>
                            </div>
                        </div>

                        <div className="copyrights">
                            <span>{song.releaseDate || "Dec 10, 2025"}</span>
                            <p>© 2025 Spotify</p>
                        </div>

                        <section className="more-songs">
                            <h2>More Songs</h2>
                            <div className="songs-scroll">
                                {randomSongs.map((item) => (
                                    <div className="thumb" key={item._id}>
                                        <div
                                            className="thumb-img"
                                            onClick={() => navigate(`/cart/${item._id}`, { replace: true })}
                                        >
                                            <img src={item.imageUrl} alt={item.title} />
                                        </div>

                                        <div className="thumb-text">
                                            <p className="thumb-title">{item.title}</p>

                                            <p className="thumb-seller">
                                                {item.uploadedBy?.name || "Unknown Seller"}
                                            </p>

                                            <div className="thumb-likes">
                                                <span className="like-icon">❤️ {item.likes}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <div id="navbar">
                            <div id="mainNavbar">
                                <div id="navbar1">
                                    <h3>Company</h3>
                                    <br />
                                    <p>About</p>
                                    <br />
                                    <p>Jobs</p>
                                    <br />
                                    <p>For the Record</p>
                                </div>

                                <div id="navbar2">
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

                                <div id="navbar3">
                                    <h3>Useful links</h3>
                                    <br />
                                    <p>Support</p>
                                    <br />
                                    <p>Free Mobile App</p>
                                    <br />
                                    <p>Popular by Country</p>
                                </div>

                                <div id="navbar4">
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
                                    <div id="icon-containers">
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
                    </main>
                </div>
            </div>
        </>
    );
}