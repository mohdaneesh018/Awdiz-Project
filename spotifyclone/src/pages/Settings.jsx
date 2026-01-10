import { useState } from "react"; 
import toast from "react-hot-toast";
import SellerLayout from "./SellerLayout";
import { useNavigate } from "react-router-dom"; 
import api from "../utils/AxiosInstance";

const Settings = () => {
    const [oldPassword, setOld] = useState("");
    const [newPassword, setNew] = useState("");

    const navigate = useNavigate();

    const changePassword = async () => {
        try {
            await api.put(
                "/auth/change-password",
                { oldPassword, newPassword },
                { withCredentials: true }
            );

            toast.success("Password updated!");

            setTimeout(() => {
                navigate("/seller/dashboard")
            }, 1500);

        } catch (err) {
            toast.error("Password update failed");
        }
    };

    return (
        <SellerLayout>
            <div className="profile-page">
                <h1>Settings</h1>

                <div className="profile-box">
                    <label>Old Password:</label>
                    <input
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOld(e.target.value)}
                    />

                    <label>New Password:</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNew(e.target.value)}
                    />

                    <button onClick={changePassword}>
                        Change Password
                    </button>
                </div>
            </div>
        </SellerLayout>
    );
};

export default Settings;
