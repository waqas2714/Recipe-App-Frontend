import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/home.css";
import Recipe from "../components/Recipe";
import axios from "axios";
import { backendUrl } from "../utils/url";
import { CiFilter } from "react-icons/ci";
import { RiShutDownLine } from "react-icons/ri";
import AdminRecipe from "../components/AdminRecipe";

const recipeDetailsInitialState = {
  name: "",
  time: "",
  createdAt: "",
  mainIngredient: "",
  note: "",
};

const AdminSingle = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchRecipes, setSearchRecipes] = useState([]);
  const [recipeDetails, setRecipeDetails] = useState(recipeDetailsInitialState);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [searchUser, setSearchUser] = useState("");

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
      const { data } = await axios.get(`${backendUrl}/recipe/adminRecipes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data.error) {
        toast.error(data.error);
      } else {
        setRecipes(data);
        setSearchRecipes(data);
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

  const filterRecipes = (filterBy) => {
    let sortedRecipes = [...searchRecipes];
    if (filterBy === "newDate") {
      sortedRecipes.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    } else if (filterBy === "oldDate") {
      sortedRecipes.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
    } else if (filterBy === "name") {
      sortedRecipes.sort((a, b) => a.name.localeCompare(b.name));
    }
    setSearchRecipes(sortedRecipes);
  };

  const filterObjectsBySearch = () => {
    const filteredObjects = recipes.filter((recipe) => {
      const nameMatch = searchName
        ? recipe.name.toLowerCase().includes(searchName.toLowerCase())
        : true;
      const userMatch = searchUser
        ? recipe.user.toLowerCase().includes(searchUser.toLowerCase())
        : true;
      return nameMatch && userMatch;
    });
    setSearchRecipes(filteredObjects);
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/");
      toast.error("Please log in.");
    } else {
      getRecipes();
    }
  }, []);

  useEffect(() => {
    filterObjectsBySearch();
  }, [searchName, searchUser]);

  return (
    <>
      <div className="search-container">
        <input
          className="search"
          type="text"
          placeholder="Search Recipe by Name"
          value={searchName}
          onChange={(e) => {
            setSearchName(e.target.value);
          }}
        />

        <input
          className="search"
          type="text"
          placeholder="Search Recipe by User"
          value={searchUser}
          onChange={(e) => {
            setSearchUser(e.target.value);
          }}
        />
      </div>

      <div className="top-btns" onClick={() => setIsFilterOpen(false)}>
        <h1 onClick={logout}>
          <RiShutDownLine size={35} className="logout" />
        </h1>
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
            <p>User</p>
          </div>
          {searchRecipes.length > 0 ? (
            searchRecipes.map((item, index) => (
              <AdminRecipe
                key={item._id}
                index={index + 1}
                name={item.name}
                time={item.time}
                createdAt={item.createdAt}
                mainIngredient={item.mainIngredient}
                note={item.note}
                userName={item.user}
                setIsDetailModalOpen={setIsDetailModalOpen}
                setRecipeDetails={setRecipeDetails}
              />
            ))
          ) : (
            <h4 style={{ textAlign: "center", marginTop: "1rem" }}>
              No recipes found.
            </h4>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminSingle;
