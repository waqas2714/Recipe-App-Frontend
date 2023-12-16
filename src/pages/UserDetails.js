import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { backendUrl } from "../utils/url";
import AdminRecipe from "../components/AdminRecipe";


const UserDetails = (props) => {
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();
  const { userId } = useParams();

  const userData = localStorage.getItem("user");
  const { _id } = userData ? JSON.parse(userData) : {};
  
  if (!_id) {
    navigate("/");
    toast.error("Please log in.");
  }

  const getRecipes = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/admin/getSingleUserData/${userId}`);
      if (data) {
        setRecipes(data);
      }

      toast.error(data.error);
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
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/");
      toast.error("PLease log in.");
    }
    getRecipes();
  }, []);

  return (
    <>
      <div className="top-btns">
        <h1 className="logout" onClick={logout}>
          Logout
        </h1>
      </div>
      <div className="recipes-container">
        <div className="recipes-table">
          <div className="contents headings">
            <p>No.</p>
            <p>Name</p>
            <p>Time{"(min)"}</p>
            <p>Created At</p>
            <p>Main Ingredient</p>
            <p>Notes</p>
          </div>
          {recipes.length > 0 ? (
            recipes.map((item, index) => {
              const dateString = item.createdAt;
              const date = new Date(dateString);
              const simplifiedFormat = `${date.getFullYear()}-${(
                date.getMonth() + 1
              )
                .toString()
                .padStart(2, "0")}-${date
                .getDate()
                .toString()
                .padStart(2, "0")} ${date
                .getHours()
                .toString()
                .padStart(2, "0")}:${date
                .getMinutes()
                .toString()
                .padStart(2, "0")}:${date
                .getSeconds()
                .toString()
                .padStart(2, "0")}`;

              return (
                <AdminRecipe
                  index={index + 1}
                  name={item.name}
                  time={item.time}
                  createdAt={simplifiedFormat}
                  mainIngredient={item.mainIngredient}
                  note={item.note}
                  id={item._id}
                />
              );
            })
          ) : (
            <h4 style={{ textAlign: "center", marginTop: "1rem" }}>
              No recipes added yet.
            </h4>
          )}
        </div>
      </div>
    </>
  );
};

export default UserDetails;
