import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/home.css";
import Recipe from "../components/Recipe";
import axios from "axios";
import { backendUrl } from "../utils/url";

const initialState = {
  name: "",
  time: null,
  mainIngredient: "",
  note: "",
};

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [newRecipe, setNewRecipe] = useState(initialState);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [updateRecipe, setUpdateRecipe] = useState({
    ...initialState,
    id: null,
  });
  const navigate = useNavigate();
  const userData = localStorage.getItem("user");
  const { _id } = userData ? JSON.parse(userData) : {};
  
  if (!_id) {
    navigate('/');
    toast.error("Please log in.");
  }

  const getRecipes = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/recipe/getRecipes/${_id}`
      );

      if (recipes) {
        setRecipes(data);
      }

      toast.error(data.error);
    } catch (error) {
      console.log(error);
    }
  };

  const updateThisRecipe = async () => {
    try {
      const { data } = await axios.put(
        `${backendUrl}/recipe/updateRecipe/${updateRecipe.id}`,
        updateRecipe
      );
      if (data) {
        getRecipes();
        toast.success("Updated");
        setIsModalOpen(false);
      } else {
        toast.success("Please try again.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteRecipe = async () => {
    try {
      const { data } = await axios.delete(
        `${backendUrl}/recipe/deleteRecipe/${updateRecipe.id}`
      );

      if (data.message) {
        getRecipes();
        toast.success(data.message);
        setIsModalOpen(false);
      } else {
        toast.error("Please try again.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addRecipe = async () => {
    try {
      const { data } = await axios.post(`${backendUrl}/recipe/addRecipe`, {
        ...newRecipe,
        userId: _id,
      });

      if (data) {
        getRecipes();
        toast.success("Added.");
        setIsAddModalOpen(false);
        setNewRecipe({...initialState, time : ""});
      } else {
        toast.error("Please try again.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const logout = (e)=>{
    e.preventDefault();
    localStorage.clear();
    navigate('/');
    toast.success("Logged out!");
  }

const handleInputChange = (event, recipeType) => {
  const { name, value } = event.target;

  if (recipeType === 'new') {
    setNewRecipe(prevRecipe => ({
      ...prevRecipe,
      [name]: value,
    }));
  } else if (recipeType === 'update') {
    setUpdateRecipe(prevRecipe => ({
      ...prevRecipe,
      [name]: value,
    }));
  }
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
      <h1 className="add" onClick={() => setIsAddModalOpen(true)}>
        +
      </h1>
    </div>
      <div className={`backdrop ${isAddModalOpen ? "" : "none"}`}>
        <div className="modal">
          <h4
            style={{ textAlign: "right", cursor: "pointer" }}
            onClick={() => setIsAddModalOpen(false)}
          >
            X
          </h4>
          <label className="modal-label">Name</label>
          <input
            type="text"
            className="modal-input"
            placeholder="Name"
            name="name"
            value={newRecipe.name}
            onChange={(e) => handleInputChange(e, 'new')}
          />
          <label className="modal-label">Time</label>
          <input
            type="text"
            className="modal-input"
            placeholder="minutes"
            name="time"
            value={newRecipe.time}
            onChange={(e) => handleInputChange(e, 'new')}
            />
          <label className="modal-label">Main Ingredient</label>
          <input
            type="text"
            className="modal-input"
            placeholder="Ingredient"
            name="mainIngredient"
            value={newRecipe.mainIngredient}
            onChange={(e) => handleInputChange(e, 'new')}
          />
          <label className="modal-label">Note</label>
          <input
            type="text"
            className="modal-input"
            placeholder="Note...."
            name="note"
            value={newRecipe.note}
            onChange={(e) => handleInputChange(e, 'new')}
          />

          <div className="action-buttons">
            <button className="update-btn" onClick={addRecipe}>
              Add
            </button>
          </div>
        </div>
      </div>

      <div className={`backdrop ${isModalOpen ? "" : "none"}`}>
        <div className="modal">
          <h4
            style={{ textAlign: "right", cursor: "pointer" }}
            onClick={() => setIsModalOpen(false)}
          >
            X
          </h4>
          <label className="modal-label">Name</label>
          <input
            type="text"
            className="modal-input"
            placeholder="Name"
            name="name"
            value={updateRecipe.name}
            onChange={(e) => handleInputChange(e, 'update')}
          />
          <label className="modal-label">Time</label>
          <input
            type="text"
            className="modal-input"
            placeholder="minutes"
            name="time"
            value={updateRecipe.time}
            onChange={(e) => handleInputChange(e, 'update')}
          />
          <label className="modal-label">Main Ingredient</label>
          <input
            type="text"
            className="modal-input"
            placeholder="Ingredient"
            name="mainIngredient"
            value={updateRecipe.mainIngredient}
            onChange={(e) => handleInputChange(e, 'update')}
          />
          <label className="modal-label">Note</label>
          <input
            type="text"
            className="modal-input"
            placeholder="Note...."
            name="note"
            value={updateRecipe.note}
            onChange={(e) => handleInputChange(e, 'update')}
          />
          <div className="action-buttons">
            <button className="update-btn" onClick={updateThisRecipe}>
              Update
            </button>
            <button className="delete-btn" onClick={deleteRecipe}>
              Delete
            </button>
          </div>
        </div>
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
                <Recipe
                  index={index + 1}
                  name={item.name}
                  time={item.time}
                  createdAt={simplifiedFormat}
                  mainIngredient={item.mainIngredient}
                  note={item.note}
                  id={item._id}
                  setIsModalOpen={setIsModalOpen}
                  updateRecipe={updateRecipe}
                  setUpdateRecipe={setUpdateRecipe}
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

export default Home;
