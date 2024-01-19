import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/admin.css";
import { backendUrl } from "../utils/url";
import User from "../components/User";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const getAllUsers = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/admin/getAllUsers`);
      setUsers(data);
    } catch (error) {
      console.log(error);
    }
  };

  const logout = (e) => {
    e.preventDefault();
    localStorage.clear();
    navigate("/");
    toast.success("Logged out!");
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <>
    <h1 className="logout-admin" onClick={logout}>
          Logout
        </h1>
      <h1 style={{textAlign : "center", backgroundColor : "rgb(214, 214, 214)", padding : "8px"}}>Admin Panel</h1>
      <div className="admin-container">
        {users.length > 0 ? (
          users.map((user) => {
            if (user !== null) {
              return <User username={user.username} userId={user._id} />;
            }
          })
        ) : (
          <h3>No Users</h3>
        )}
        
      </div>
    </>
  );
};

export default Admin;
