import React from "react";
import "../styles/home.css";
import axios from "axios";
import { backendUrl } from "../utils/url";

const AdminRecipe = ({
  index,
  name,
  time,
  createdAt,
  mainIngredient,
  note,
  id
}) => {
  return (
    <div
      className="contents"
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

export default AdminRecipe;
