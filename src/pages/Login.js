import React, { useEffect, useState } from "react";
import "../styles/auth.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { backendUrl } from "../utils/url";

const initialState = {
  username: "",
  password: "",
};

const Login = () => {
  const [data, setData] = useState(initialState);
  const { username, password } = data;
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate username and password
      if (username === "" || password === "") {
        return toast.error("Please fill all the input fields.");
      }

      // Make API request to signup endpoint
      const response = await axios.post(`${backendUrl}/auth/login`, {
        username,
        password,
      });
      const { data } = response;
      if (!data) {
        return;
      }
      const { user } = data;
      // Check response data
      localStorage.setItem('token', data.token);
      localStorage.setItem("user", JSON.stringify(user));
      if (!user.isUser) {
        return navigate('/admin');
      }
      navigate("/home");
    } catch (error) {
      // Handle network errors or other unexpected errors
      toast.error(error.response.data.error);
    }
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/home");
    }
  }, []);

  return (
    <div className="login-container">
      <div>
      <h2 style={{textAlign: "center", marginBottom : "1rem"}}>Login</h2>
        <form onSubmit={handleSubmit}>
          <label>Username</label>
          <input
            type="text"
            placeholder="Username"
            name="username"
            value={username}
            onChange={handleInputChange}
          />
          <label>Password</label>
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={handleInputChange}
          />
          <button type="submit">Login</button>
          <Link to={"/signup"} className="link">
            Don't have an account?
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;
