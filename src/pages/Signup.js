import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css";
import { toast } from "react-toastify";
import axios from "axios";
import { backendUrl } from "../utils/url";

const initialState = {
  username: "",
  password: "",
};

const Signup = () => {
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
      const response = await axios.post(`${backendUrl}/auth/signup`, {
        username,
        password,
      });
      const { data } = response;

      // Check response data
      if (!data) {
        return;
      }

      const { user } = data;

      // Handle successful signup
      localStorage.setItem("user", JSON.stringify(user));
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
      <h2 style={{textAlign: "center", marginBottom : "1rem"}}>Signup</h2>
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
          <button type="submit">Signup</button>
          <Link to={"/"} className="link">
            Already have an account?
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Signup;
