import { useState } from "react"; 
import SellerLayout from "../pages/SellerLayout";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "../styles/uploadSong.css";
import api from "../utils/AxiosInstance";

const UploadSong = () => {
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [artistSlug, setArtistSlug] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!title) return toast.error("Song title is required");
    if (!imageUrl) return toast.error("Image URL is required");
    if (!audioFile) return toast.error("Please upload an audio file");
    if (!artistSlug) return toast.error("Please select artist");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("imageUrl", imageUrl);
    formData.append("audio", audioFile);
    formData.append("artistSlug", artistSlug);

    try {
      setLoading(true);

      await api.post(
        "/seller/upload-song",
        formData,
        { withCredentials: true }
      );

      toast.success("Song uploaded successfully!");

      setTimeout(() => {
        navigate("/my-songs");
      }, 1500);
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SellerLayout>
      <h1 className="upload-name">Upload Song</h1>

      <div className="upload-top"> 
        <div className="upload-field">
          <label className="upload-label">Song Title</label>
          <input
            className="upload-input"
            placeholder="Enter song title"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
 
        <div className="upload-field">
          <label className="upload-label">Artist</label>
          <select
            className="upload-select"
            value={artistSlug}
            onChange={(e) => setArtistSlug(e.target.value)}
          >
            <option value="">Select Artist</option>
            <option value="pritam">Pritam</option>
            <option value="ar-rahman">A. R. Rahman</option>
            <option value="arijit-singh">Arijit Singh</option>
            <option value="sachin-jigar">Sachin Jigar</option>
            <option value="atif-aslam">Atif Aslam</option>
            <option value="honey-singh">Yo Yo Honey Singh</option>
            <option value="anirudh-ravichander">Anirudh Ravichander</option>
          </select>
        </div>
 
        <div className="upload-field">
          <label className="upload-label">Album Cover URL</label>
          <input
            className="upload-input"
            placeholder="Paste image URL"
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>
 
        <div className="upload-field">
          <label className="upload-label">Audio File</label>
          <input
            className="upload-file"
            type="file"
            accept="audio/mp3, audio/*"
            onChange={(e) => setAudioFile(e.target.files[0])}
          />

          {audioFile && (
            <p className="upload-audio-info">
              Selected: <b>{audioFile.name}</b> (
              {(audioFile.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>
 
        {audioFile && (
          <div className="upload-audio-preview">
            <audio
              className="upload-audio-player"
              controls
              src={URL.createObjectURL(audioFile)}
            />
          </div>
        )}
 
        {imageUrl && (
          <div className="upload-image-preview">
            <h4 className="upload-preview-title">Album Preview</h4>
            <img className="upload-preview-img" src={imageUrl} alt="" />
          </div>
        )}
 
        <button
          className={`upload-btn ${loading ? "upload-btn-disabled" : ""}`}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload Song"}
        </button>
      </div>
    </SellerLayout>
  );
};

export default UploadSong;
