import React from "react";
import "../styles/home.css";
import axios from "axios";
import { backendUrl } from "../utils/url";
import { CiEdit } from "react-icons/ci";

const AdminRecipe = ({
  index,
  name,
  time,
  createdAt,
  mainIngredient,
  note,
  userName,
  setIsDetailModalOpen,
  setRecipeDetails,
}) => {
  
  return (
    <div
      className="contents"
      onClick={() => {
        setRecipeDetails({
          name,
          time,
          createdAt,
          mainIngredient,
          note,
        });
        setIsDetailModalOpen(true);
      }}
      
    >
      <p>{index}</p>
      <p>{name}</p>
      <p>{time + "(min)"}</p>
      <p style={{ fontSize: "0.7rem" }}>{createdAt}</p>
      {/* <p>{mainIngredient}</p> */}
      <p>{userName}</p>
    </div>
  );
};

export default AdminRecipe;
