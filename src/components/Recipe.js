import React from "react";
import "../styles/home.css";
import axios from "axios";
import { backendUrl } from "../utils/url";
import { CiEdit } from "react-icons/ci";

const Recipe = ({
  index,
  name,
  time,
  createdAt,
  mainIngredient,
  note,
  id,
  setIsModalOpen,
  updateRecipe,
  setUpdateRecipe,
  setIsDetailModalOpen,
  setRecipeDetails,
}) => {
  const fillRecipe = async (event) => {
    try {

      event.stopPropagation();
      
      const token = localStorage.getItem("token");

      if (!token) {
        // Handle case where token is not available
        return;
      }

      const { data } = await axios.get(`${backendUrl}/recipe/getRecipe/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data) {
        setUpdateRecipe({
          name: data.name,
          time: data.time,
          mainIngredient: data.mainIngredient,
          note: data.note,
          id,
        });
        setIsModalOpen(true);
      } else {
        console.log("No data received");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

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
      {/* <p>{mainIngredient}</p>
      <p>{note}</p> */}
      <p
        onClick={(event) => {
          fillRecipe(event);
        }}
      >
        <CiEdit size={30} style={{ cursor: "pointer" }} />
      </p>
    </div>
  );
};

export default Recipe;
