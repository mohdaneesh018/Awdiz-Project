import { Routes, Route } from "react-router-dom";
import "./App.css";

import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UploadSong from "./pages/UploadSong";
import SellerDashboard from "./pages/SellerDashboard";
import MySongs from "./pages/MySongs";
import EditSong from "./pages/EditSong";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import SongDetail from "./pages/SongDetail";
import Artist from "./pages/Artist";
import AudioProvider from "./context/AudioContext";
import GlobalPlayer from "./components/GlobalPlayer";
import Radio from "./pages/Radio";
import Seller from "./pages/Seller";
import SearchResults from "./pages/SearchResults";
import Playlist from "./pages/Playlist";
import AdminRoute from "./routes/AdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import SellerRoute from "./routes/SellerRoute";  

function App() {
  return (
    <AudioProvider>
      <>
        <Routes> 
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/song/:id" element={<SongDetail />} />
          <Route path="/artist/:id" element={<Artist />} />
          <Route path="/seller/:sellerId" element={<Seller />} />
          <Route path="/radio/:sellerId" element={<Radio />} />
          <Route path="/search/:query" element={<SearchResults />} />
          <Route path="/playlist/:id" element={<Playlist />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/cart/:id" element={<Cart />} />
 
          <Route element={<SellerRoute />}>
            <Route path="/seller/dashboard" element={<SellerDashboard />} />
            <Route path="/upload-song" element={<UploadSong />} />
            <Route path="/my-songs" element={<MySongs />} />
            <Route path="/edit-song/:id" element={<EditSong />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
 
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
        </Routes>

        <GlobalPlayer />
      </>
    </AudioProvider>
  );
}

export default App;