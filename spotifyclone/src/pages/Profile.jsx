import { useEffect, useState } from "react"; 
import SellerLayout from "./SellerLayout";
import toast from "react-hot-toast";
import "../styles/profile.css";
import { useNavigate } from "react-router-dom";
import api from "../utils/axiosInstance";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            const res = await api.get(
                "/auth/me",
                { withCredentials: true }
            );

            setUser(res.data.user);
            setName(res.data.user.name);
            setEmail(res.data.user.email);
        };

        fetchUser();
    }, []);

    const updateProfile = async () => {
        try {
            await api.put(
                "/auth/update-profile",
                { name, email },
                { withCredentials: true }
            );

            toast.success("Profile updated!");

            setTimeout(() => {
                navigate("/seller/dashboard");
            }, 1500);

        } catch (err) {
            toast.error("Update failed");
        }
    };

    if (!user) return <SellerLayout>Loading...</SellerLayout>;

    return (
        <SellerLayout>
            <div className="profile-page">
                <h1>Edit Profile</h1>

                <div className="profile-box">
                    <label>Name:</label>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <label>Email:</label>
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <button onClick={updateProfile}>
                        Save Changes
                    </button>
                </div>
            </div>
        </SellerLayout>
    );
};

export default Profile;