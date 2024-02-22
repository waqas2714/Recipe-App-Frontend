import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/home.css";
import Recipe from "../components/Recipe";
import axios from "axios";
import { backendUrl } from "../utils/url";
import { CiFilter } from "react-icons/ci";
import { RiShutDownLine } from "react-icons/ri";

const initialState = {
  name: "",
  time: null,
  mainIngredient: "",
  note: "",
};

const recipeDetailsInitialState = {
  name: "",
  time: "",
  createdAt: "",
  mainIngredient: "",
  note: "",
};

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchRecipes, setSearchRecipes] = useState([]);
  const [newRecipe, setNewRecipe] = useState(initialState);
  const [recipeDetails, setRecipeDetails] = useState(recipeDetailsInitialState);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [search, setSearch] = useState("");

  const [updateRecipe, setUpdateRecipe] = useState({
    ...initialState,
    id: null,
  });
  const navigate = useNavigate();
  const userData = localStorage.getItem("user");
  const { _id } = userData ? JSON.parse(userData) : {};
  const token = localStorage.getItem("token");

  if (!_id) {
    navigate("/");
    toast.error("Please log in.");
  }

  const getRecipes = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/recipe/getRecipes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (recipes) {
        setRecipes(data);
      }

      toast.error(data.error);
    } catch (error) {
      console.log(error);
    }
  };

  const updateThisRecipe = async () => {
    const { name, time, newIngredient, note } = updateRecipe;

    if (name === "" || time === "" || newIngredient === "" || note === "") {
      return toast.error("Please fill all the fields.");
    }

    if (/\D/.test(updateRecipe.time)) {
      return toast.error("Please add time with numeric values.");
    }

    try {
      const { data } = await axios.put(
        `${backendUrl}/recipe/updateRecipe/${updateRecipe.id}`,
        updateRecipe,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
        `${backendUrl}/recipe/deleteRecipe/${updateRecipe.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
    const { name, time, newIngredient, note } = newRecipe;

    if (name === "" || time === "" || newIngredient === "" || note === "") {
      return toast.error("Please fill all the fields.");
    }

    if (/\D/.test(newRecipe.time)) {
      return toast.error("Please add time with numeric values.");
    }

    try {
      const { data } = await axios.post(
        `${backendUrl}/recipe/addRecipe`,
        newRecipe,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data) {
        getRecipes();
        toast.success("Added.");
        setIsAddModalOpen(false);
        setNewRecipe({ ...initialState, time: "" });
      } else {
        toast.error("Please try again.");
      }
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

  const handleInputChange = (event, recipeType) => {
    const { name, value } = event.target;

    if (recipeType === "new") {
      setNewRecipe((prevRecipe) => ({
        ...prevRecipe,
        [name]: value,
      }));
    } else if (recipeType === "update") {
      setUpdateRecipe((prevRecipe) => ({
        ...prevRecipe,
        [name]: value,
      }));
    }
  };

  const filterRecipes = (filterBy) => {
    let sortedRecipes;
    if (filterBy === "newDate") {
      if (search.length > 0) {
        sortedRecipes = [...searchRecipes].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      } else {
        sortedRecipes = [...recipes].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      }
    } else if (filterBy === "oldDate") {
      if (search.length > 0) {
        sortedRecipes = [...searchRecipes].sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
      } else {
        sortedRecipes = [...recipes].sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
      }
    } else if (filterBy === "name") {
      if (search.length > 0) {
        sortedRecipes = [...searchRecipes].sort((a, b) => {
          const nameA = a.name.toLowerCase();
          const nameB = b.name.toLowerCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });
      } else {
        sortedRecipes = [...recipes].sort((a, b) => {
          const nameA = a.name.toLowerCase();
          const nameB = b.name.toLowerCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });
      }
    }
    if (search.length > 0) {
      setSearchRecipes(sortedRecipes);
    } else {
      setRecipes(sortedRecipes);
    }
  };

  function filterObjectsBySearch(searchTerm) {
    const filteredObjects = recipes.filter((obj) => {
      if (typeof obj.name === "string") {
        return obj.name.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return false;
    });

    setSearchRecipes(filteredObjects);
  }
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
      <div className="search-container">
        <input
          className="search"
          type="text"
          placeholder="Search Here"
          name="search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            filterObjectsBySearch(e.target.value);
          }}
        />
      </div>

      <div className="top-btns" onClick={() => setIsFilterOpen(false)}>
        <h1 className="add" onClick={() => setIsAddModalOpen(true)}>
          +
        </h1>
        <div></div>
        <h1 onClick={logout}>
          <RiShutDownLine size={35} className="logout" />
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
            onChange={(e) => handleInputChange(e, "new")}
          />
          <label className="modal-label">Time</label>
          <input
            type="text"
            className="modal-input"
            placeholder="minutes"
            name="time"
            value={newRecipe.time}
            onChange={(e) => handleInputChange(e, "new")}
          />
          <label className="modal-label">Main Ingredient</label>
          <input
            type="text"
            className="modal-input"
            placeholder="Ingredient"
            name="mainIngredient"
            value={newRecipe.mainIngredient}
            onChange={(e) => handleInputChange(e, "new")}
          />
          <label className="modal-label">Note</label>
          <input
            type="text"
            className="modal-input"
            placeholder="Note...."
            name="note"
            value={newRecipe.note}
            onChange={(e) => handleInputChange(e, "new")}
          />

          <div className="action-buttons">
            <button
              className="update-btn"
              style={{ backgroundColor: "rgb(84 199 49)" }}
              onClick={addRecipe}
            >
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
            onChange={(e) => handleInputChange(e, "update")}
          />
          <label className="modal-label">Time</label>
          <input
            type="text"
            className="modal-input"
            placeholder="minutes"
            name="time"
            value={updateRecipe.time}
            onChange={(e) => handleInputChange(e, "update")}
          />
          <label className="modal-label">Main Ingredient</label>
          <input
            type="text"
            className="modal-input"
            placeholder="Ingredient"
            name="mainIngredient"
            value={updateRecipe.mainIngredient}
            onChange={(e) => handleInputChange(e, "update")}
          />
          <label className="modal-label">Note</label>
          <input
            type="text"
            className="modal-input"
            placeholder="Note...."
            name="note"
            value={updateRecipe.note}
            onChange={(e) => handleInputChange(e, "update")}
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
      <div>
        <CiFilter
          className="filter"
          size={30}
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        />
        <div className={`filter-options ${!isFilterOpen && "none"}`}>
          <div className="option" onClick={() => filterRecipes("newDate")}>
            Recent
          </div>
          <div className="option" onClick={() => filterRecipes("oldDate")}>
            Old
          </div>
          <div className="option" onClick={() => filterRecipes("name")}>
            Name
          </div>
        </div>
      </div>

      <div className={`backdrop ${isDetailModalOpen ? "" : "none"}`}>
        <div className="recipe-detail modal" style={{ position: "relative" }}>
          <h4
            style={{
              position: "absolute",
              right: "13px",
              top: "5px",
              fontSize: "1.5rem",
              cursor: "pointer",
            }}
            onClick={() => {
              setRecipeDetails(recipeDetailsInitialState);
              setIsDetailModalOpen(false);
            }}
          >
            X
          </h4>
          <div className="name-time">
            <div className="name">
              <h2>Name:</h2>
              <p>{recipeDetails.name}</p>
            </div>
            <div className="time">
              <h2>Time:</h2>
              <p>{recipeDetails.time}</p>
            </div>
          </div>
          <div className="created-at">
            <h2>Created At</h2>
            <p>{recipeDetails.createdAt}</p>
          </div>
          <div className="main-ingredient">
            <h2>Main Ingredients</h2>
            <p>{recipeDetails.mainIngredient}</p>
          </div>
          <div className="detail-note" style={{ overflow: "auto" }}>
            <h2>Note</h2>
            <p>{recipeDetails.note}</p>
          </div>
        </div>
      </div>

      <div className="recipes-container" onClick={() => setIsFilterOpen(false)}>
        <div className="recipes-table">
          <div className="contents headings">
            <p>No.</p>
            <p>Name</p>
            <p>Time{"(min)"}</p>
            <p>Created At</p>
            {/* <p>Main Ingredient</p>
            <p>Notes</p> */}
            <p>Action</p>
          </div>
          {recipes.length > 0 ? (
            search.length > 0 ? (
              searchRecipes.map((item, index) => {
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
                    setRecipeDetails={setRecipeDetails}
                  />
                );
              })
            ) : (
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
                    setIsDetailModalOpen={setIsDetailModalOpen}
                    updateRecipe={updateRecipe}
                    setUpdateRecipe={setUpdateRecipe}
                    setRecipeDetails={setRecipeDetails}
                  />
                );
              })
            )
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
