import { useEffect, useState } from "react";
import axios from "axios";
import SellerLayout from "./SellerLayout";
import toast from "react-hot-toast";
import "../styles/profile.css";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [name, setName] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            const res = await axios.get(
                "http://localhost:3000/api/auth/me",
                { withCredentials: true }
            );
            setUser(res.data.user);
            setName(res.data.user.name);
        };
        fetchUser();
    }, []);

    const updateProfile = async () => {
        try {
            await axios.put(
                "http://localhost:3000/api/auth/update-profile",
                { name },
                { withCredentials: true }
            );

            toast.success("Profile updated!");

            setTimeout(() => {
                navigate("/seller/dashboard")
            }, 1500);

        } catch (err) {
            toast.error("Update failed");
        }
    };

    if (!user) return <SellerLayout>Loading....</SellerLayout>;

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
                    <input value={user.email} readOnly />

                    <button onClick={updateProfile}>
                        Save Changes
                    </button>
                </div>
            </div>
        </SellerLayout>
    );
};

export default Profile;
