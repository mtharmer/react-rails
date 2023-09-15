import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function EditRecipe() {
  const navigate = useNavigate();
  const params = useParams();
  const [recipe, setRecipe] = useState({
    name: "",
    ingredients: "",
    instruction: "",
    image: ""
  });

  useEffect(() => {
    const url = `/api/v1/show/${params.id}`;
    fetch(url).then((res) => {
      if (res.ok) {
        return res.json();
      }
      throw new Error("Network response was not ok");
    }).then((res) => {
      setRecipe(res);
    })
    .catch((err) => console.log(err.message));
  }, [params.id]);

  const stripHtml = (str) => String(str).replace(/\n/g, "<br> <br>").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const onChange = (event) => {
    setRecipe((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value
    }));
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const url = `/api/v1/edit/${params.id}`;

    if (recipe.name.length == 0 || recipe.ingredients.length == 0 || recipe.instruction.length == 0) {
      return;
    }

    const body = {
      name: recipe.name,
      ingredients: recipe.ingredients,
      instruction: stripHtml(recipe.instruction),
      image: recipe.image,
    };

    const token = document.querySelector('meta[name="csrf-token"]').content;
    fetch(url, {
      method: "PUT",
      headers: {
        "X-CSRF-Token": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
      throw new Error("Network response was not ok");
    })
    .then((res) => navigate(`/recipe/${res.id}`))
    .catch((err) => console.log(err.message));
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-sm-12 col-lg-6 offset-lg-3">
          <h1 className="font-weight-normal mb-5">
            Add a new recipe
          </h1>
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label htmlFor="recipeName">Recipe Name</label>
              <input type="text" name="name" id="recipeName" className="form-control" required value={recipe.name}
                onChange={(event) => onChange(event)} />
            </div>
            <div className="form-group">
              <label htmlFor="recipeIngredients">Ingredients</label>
              <input type="text" name="ingredients" id="recipeIngredients" className="form-control" required
                value={recipe.ingredients} onChange={(event) => onChange(event)} />
              <small id="ingredientsHelp" className="form-text text-muted">
                Separate each ingredient with a comma
              </small>
            </div>
            <div className="form-group">
              <label htmlFor="recipeImage">Image URL</label>
              <input type="text" name="image" id="recipeImage" className="form-control" value={recipe.image}
                onChange={(event) => onChange(event)} />
            </div>
            <div className="form-group">
              <label htmlFor="instruction">Preparation instructions</label>
              <textarea className="form-control" id="instruction" name="instruction" rows="5" required
                value={recipe.instruction} onChange={(event) => onChange(event)} />
            </div>
            <button type="submit" className="btn custom-button mt-3">
              Save Changes
            </button>
            <Link to={`/recipe/${params.id}`} className="btn btn-link mt-3">
              Back to recipe
            </Link>
          </form>
        </div>
      </div>
    </div>
  );

}
