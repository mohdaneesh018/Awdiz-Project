import { useState } from "react"; 
import "../styles/login.css";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../utils/AxiosInstance";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const router = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = await api.post(
        "/auth/login",
        form,
        { withCredentials: true }
      );

      if (res.data.success) {
 
        localStorage.setItem(
          "user",
          JSON.stringify(res.data.user)
        );
 
        if (res.data.user.role === "admin") {
          router("/admin/dashboard");
        } else if (res.data.user.role === "seller") {
          router("/seller/dashboard");
        } else {
          router("/");
        }

        toast.success("Login Successful!");
      }

    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
      console.log(err);
    }
  };


  return (
    <div className="login-container">
      <div className="login-box">

        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSd4jbXkWaYRcqw7zkFheo1YSlmlUSaEZyQFw&s"
          className="logo"
          alt="logo"
        />

        <h1 className="login-title">Welcome back</h1>

        <label className="label">Email</label>
        <input
          type="text"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="input"
        />

        <label className="label">Password</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          className="input"
        />

        <button className="continue-btn" onClick={handleSubmit}>
          Login
        </button>

        <div className="or">or</div>

        <button className="google-btn">
          <img src="https://www.svgrepo.com/show/355037/google.svg" alt="" />
          Sign up with Google
        </button>

        <button className="apple-btn">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRsP-EH-Fc-gjQMFgxj4g1pkFGVCK8Y2deHA&s"
            alt=""
          />
          Sign up with Apple
        </button>

        <p className="no-account">Don't have an account?</p>

        <Link to="/register">
          <button className="signup-btn">Sign up</button>
        </Link>

        <p className="footer-note">
          This site is protected by reCAPTCHA and the Google <br />
          <a href="#">Privacy Policy</a> and <a href="#">Terms of Service</a> apply.
        </p>

      </div>
    </div>
  );
};

export default Login;
