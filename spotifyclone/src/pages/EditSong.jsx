import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import SellerLayout from "./SellerLayout";
import toast from "react-hot-toast";
import "../styles/editSong.css";

const EditSong = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [newAudio, setNewAudio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSong = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/seller/song/${id}`,
          { withCredentials: true }
        );

        if (!res.data || !res.data.song) {
          toast.error("Song not found");
          return navigate("/my-songs");
        }

        setForm(res.data.song);
      } catch (err) {
        toast.error("Failed to load song");
        navigate("/my-songs");
      } finally {
        setLoading(false);
      }
    };

    fetchSong();
  }, [id, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const updateSong = async () => {
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("imageUrl", form.imageUrl);

      if (newAudio) {
        fd.append("audio", newAudio);
      }

      await axios.put(
        `http://localhost:3000/api/seller/update-song/${id}`,
        fd,
        { withCredentials: true }
      );

      toast.success("Song updated!");
      navigate("/my-songs");
    } catch (err) {
      toast.error("Failed to update");
    }
  };

  if (loading || !form) {
    return (
      <SellerLayout>
        <p style={{ color: "white", padding: 20 }}>
          Loading song details....
        </p>
      </SellerLayout>
    );
  }

  return (
    <SellerLayout>
      <div className="edit-container">
        <h1>Edit Song</h1>

        <div className="edit-box">
          <label>Song Title</label>
          <input
            name="title"
            value={form.title || ""}
            onChange={handleChange}
          />

          <label>Image URL</label>
          <input
            name="imageUrl"
            value={form.imageUrl || ""}
            onChange={handleChange}
          />

          <div className="edit-row">
            <div>
              <span className="edit-label-small">Current Image</span>
              {form.imageUrl && <img src={form.imageUrl} alt="cover" />}
            </div>

            <div>
              <span className="edit-label-small">Current Audio</span>
              {form.audioUrl && (
                <audio
                  controls
                  className="edit-audio"
                  src={
                    form.audioUrl.startsWith("http")
                      ? form.audioUrl
                      : `http://localhost:3000${form.audioUrl}`
                  }
                />
              )}
            </div>
          </div>
 
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setNewAudio(e.target.files[0])}
          />

          <button className="save-btn" onClick={updateSong}>
            Save Changes
          </button>
        </div>
      </div>
    </SellerLayout>
  );
};

export default EditSong;
