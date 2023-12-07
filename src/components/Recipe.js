import React from "react";
import "../styles/home.css";
import axios from "axios";
import { backendUrl } from "../utils/url";

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
}) => {
  
  const fillRecipe = async ()=>{
    try {
      const {data} = await axios.get(`${backendUrl}/recipe/getRecipe/${id}`);
      if (data) {
        setUpdateRecipe({ name : data.name, time : data.time, mainIngredient : data.mainIngredient, note : data.note, id});
        console.log(updateRecipe);
        setIsModalOpen(true);
      }else{
        console.log();
      }


    } catch (error) {
      console.log(error.message);
    }
  }
  return (
    <div
      className="contents"
      onClick={() => {
        fillRecipe();  
      }}
    >
      <p>{index}</p>
      <p>{name}</p>
      <p>{time + "(min)"}</p>
      <p style={{ fontSize: "0.7rem" }}>{createdAt}</p>
      <p>{mainIngredient}</p>
      <p>{note}</p>
    </div>
  );
};

export default Recipe;
