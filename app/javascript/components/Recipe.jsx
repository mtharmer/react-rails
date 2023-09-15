import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function Recipe() {
  const params = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState({ ingredients: "" });

  useEffect(() => {
    const url = `/api/v1/show/${params.id}`;
    fetch(url)
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
      throw new Error("Network response was not ok");
    })
    .then((res) => setRecipe(res))
    .catch(() => navigate("/recipes"));
  }, [params.id]);

  const addHtmlEntities = (str) => {
    return String(str).replace(/&lt;/g, "<").replace(/&gt;/g, ">");
  };

  const deleteRecipe = () => {
    const url = `/api/v1/destroy/${params.id}`;
    const token = document.querySelector('meta[name="csrf-token"]').content;
    fetch((url), {
      method: "DELETE",
      headers: {
        "X-CSRF-Token": token,
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
      throw new Error("Network response was not ok");
    })
    .then(() => navigate("/recipes"))
    .catch((err) => console.log(err.message));
  };

  const ingredientList = () => {
    let ingredientList = "No ingredients available";
    if (recipe.ingredients.length > 0) {
      ingredientList = recipe.ingredients.split(",").map((ingredient, index) => (
        <li key={index} className="list-group-item">{ingredient}</li>
      ));
    }
    return ingredientList;
  };

  const recipeInstruction = addHtmlEntities(recipe.instruction);

  const editRecipe = () => navigate(`/edit/recipe/${params.id}`);

  return (
    <div className="">
      <div className="hero position-relative d-flex align-items-center justify-content-center">
        <img src={recipe.image} alt={`${recipe.name} image`} />
        <div className="overlay bg-dark position-absolute" />
        <h1 className="display-4 position-relative text-white">
          {recipe.name}
        </h1>
      </div>
      <div className="container py-5">
        <div className="row">
          <div className="col-sm-12 col-lg-3">
            <ul className="list-group">
              <h5 className="mb-2">Ingredients</h5>
              {ingredientList()}
            </ul>
          </div>
          <div className="col-sm-12 col-lg-7">
            <h5 className="mb-2">Preparation Instructions</h5>
            <div dangerouslySetInnerHTML={{__html: `${recipeInstruction}`, }} />
          </div>
          <div className="col-sm-12 col-lg-2">
            <div className="row">
              <button type="button" className="btn btn-info" onClick={editRecipe}>
                Edit Recipe
              </button>
            </div>
            <div className="row">
              <button type="button" className="btn btn-danger" onClick={deleteRecipe}>
                Delete Recipe
              </button>
            </div>
          </div>
        </div>
        <Link to="/recipes" className="btn btn-link">
          Back to recipes
        </Link>
      </div>
    </div>
  );
};
