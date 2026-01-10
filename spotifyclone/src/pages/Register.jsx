import React, { useState } from "react"; 
import "../styles/register.css";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../utils/AxiosInstance";

const Register = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "user",
    });

    const router = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            const res = await api.post(
                "/auth/register",
                form
            );

            if (res.data.success) {
                toast.success("Register Successfully.");
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.log("Register OTP Error:", error);
            toast.error(error.response?.data?.message || "Server error");
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-box">

                <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSd4jbXkWaYRcqw7zkFheo1YSlmlUSaEZyQFw&s"
                    className="logo"
                    alt="logo"
                />

                <h1 className="title">Sign up to</h1>
                <h1 className="title2">start listening</h1>

                <label className="label">Full Name</label>
                <input
                    type="text"
                    className="input"
                    name="name"
                    placeholder="Enter full name"
                    onChange={handleChange}
                />

                <label className="label">Email address</label>
                <input
                    type="email"
                    className="input"
                    name="email"
                    placeholder="name@domain.com"
                    onChange={handleChange}
                />

                <label className="label">Password</label>
                <input
                    type="password"
                    className="input"
                    name="password"
                    placeholder="Enter password"
                    onChange={handleChange}
                />

                <label className="label">Role</label>
                <select
                    className="input"
                    name="role"
                    onChange={handleChange}
                >
                    <option value="user">User</option>
                    <option value="seller">Seller</option>
                    <option value="admin">Admin</option>
                </select>

                <button className="next-btn" onClick={handleSubmit}>
                    Register
                </button>

                <div className="or">or</div>

                <div className="google-btns">
                    <img src="https://www.svgrepo.com/show/355037/google.svg" alt="" />
                    Sign up with Google
                </div>

                <div className="apple-btns">
                    <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRsP-EH-Fc-gjQMFgxj4g1pkFGVCK8Y2deHA&s"
                        alt=""
                    />
                    Sign up with Apple
                </div>

                <p className="already-text">Already have an account?</p>

                <Link to="/login">
                    <button className="login-btn">Log in</button>
                </Link>

                <p className="footer-note">
                    This site is protected by reCAPTCHA and the Google <br />
                    <a href="#">Privacy Policy</a> and <a href="#">Terms of Service</a> apply.
                </p>
            </div>
        </div>
    );
};

export default Register;
