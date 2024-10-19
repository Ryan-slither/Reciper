/* eslint-disable no-undef */
import express from "express";
import cors from "cors";
import pg from "pg";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import axios from "axios";
import { query, validationResult } from "express-validator";

dotenv.config({ path: "./.env" });

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT;
const SALTS = 10;

const db = new pg.Client({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.DATABASEPORT,
});
db.connect();

let userId = -1;
app.post(
  "/login",
  query("email")
    .trim()
    .notEmpty()
    .isLength({ max: 100 })
    .isEmail()
    .custom(async (value) => {
      const user = await db.query("SELECT * FROM users WHERE username = $1", [
        value,
      ]);
      if (user.rows.length === 0) {
        throw new Error("Username does not exist");
      } else {
        userId = user.rows[0].id;
      }
    }),
  query("password")
    .trim()
    .notEmpty()
    .isLength({ min: 8, max: 20 })
    .custom(async (value) => {
      console.log(userId);
      const user = await db.query("SELECT * FROM users WHERE id = $1", [
        userId,
      ]);
      const storedPassword = user.rows[0].password_encrypted;
      if (!(await bcrypt.compare(value, storedPassword))) {
        throw new Error("Password is incorrect");
      }
    }),
  (request, response) => {
    const result = validationResult(request);
    if (result.isEmpty()) {
      response.json({ id: userId });
      console.log("Log In Request", request.query);
    } else {
      response.send({ errors: result.array() });
    }
  }
);

app.post(
  "/signup",
  query("firstName").trim().notEmpty().isLength({ max: 20 }),
  query("email")
    .trim()
    .notEmpty()
    .isLength({ max: 100 })
    .isEmail()
    .custom(async (value) => {
      const user = await db.query("SELECT * FROM users WHERE username = $1", [
        value,
      ]);
      if (user.rows.length !== 0) {
        console.log(user.rows);
        throw new Error("Username already exists");
      }
    }),
  query("password").trim().notEmpty().isLength({ min: 8, max: 20 }),
  async (request, response) => {
    const result = validationResult(request);
    if (result.isEmpty()) {
      console.log("Sign Up Request", request.query);
      const email = request.query.email;
      const password = request.query.password;
      const firstName = request.query.firstName;
      try {
        const salt = await bcrypt.genSalt(SALTS);
        const password_encrypted = await bcrypt.hash(password, salt);
        await db.query(
          "INSERT INTO users (first_name, username, password_encrypted) VALUES ($1, $2, $3)",
          [firstName, email, password_encrypted]
        );
        const user = await db.query("SELECT * FROM users WHERE username = $1", [
          email,
        ]);
        userId = user.rows[0].id;
        response.json({ id: userId });
      } catch (err) {
        console.log(err);
      }
    } else {
      response.send({ errors: result.array() });
    }
  }
);

app.get("/dashboard", async (request, response) => {
  let recipes = [];
  const userId = request.query.id;
  try {
    const result = await db.query("SELECT * FROM recipes WHERE user_id = $1", [
      userId,
    ]);
    console.log(result);
    result.rows.forEach((row) => {
      recipes.push({
        user_id: row.user_id,
        recipe_name: row.recipe_name,
        recipe_url: row.recipe_url,
        recipe_ingredients_amount: row.recipe_ingredients_amount,
      });
    });
    console.log(recipes);
    response.send(recipes);
  } catch (err) {
    console.error(err);
  }
});

app.post("/dashboard/add", async (request, response) => {
  const title = request.query.recipe_name;
  const ingredientCount = parseInt(request.query.recipe_ingredients_amount);
  const url = request.query.recipe_url;
  const userId = parseInt(request.query.user_id);
  console.log(request.query);
  try {
    await db.query(
      "INSERT INTO recipes (recipe_name, recipe_url, recipe_ingredients_amount, user_id) VALUES ($1, $2, $3, $4)",
      [title, url, ingredientCount, userId]
    );
  } catch (err) {
    console.error(err);
  }
  response.send({ Status: "OK" });
});

app.delete("/dashboard/delete", async (request, response) => {
  const title = request.query.recipe_name;
  const ingredientCount = parseInt(request.query.recipe_ingredients_amount);
  const url = request.query.recipe_url;
  const userId = parseInt(request.query.user_id);
  console.log(request.query);
  try {
    await db.query(
      "DELETE FROM recipes WHERE recipe_name = $1 AND recipe_url = $2 AND recipe_ingredients_amount = $3 AND user_id = $4",
      [title, url, ingredientCount, userId]
    );
  } catch (err) {
    console.error(err);
  }
  response.send({ Status: "OK" });
});

app.get("/dashboard/search", async (request, response) => {
  let recipes = [];
  let bookRecipeName = request.query.book_recipe_name;
  let minIngredients = parseInt(request.query.book_min_ingredients);
  let maxIngredients = parseInt(request.query.book_max_ingredients);
  const userId = parseInt(request.query.user_id);
  console.log(request.query);
  try {
    if (!minIngredients) {
      minIngredients = 0;
    }
    if (!maxIngredients) {
      maxIngredients = 99999;
    }
    if (!bookRecipeName) {
      bookRecipeName = "%";
    } else {
      bookRecipeName = String.raw`%${bookRecipeName}%`;
    }
    const result = await db.query(
      "SELECT * FROM recipes WHERE recipe_name ILIKE $1 AND recipe_ingredients_amount >= $2 AND recipe_ingredients_amount <= $3 AND user_id = $4",
      [bookRecipeName, minIngredients, maxIngredients, userId]
    );
    console.log(result.rows);
    result.rows.forEach((row) => {
      recipes.push({
        user_id: row.user_id,
        recipe_name: row.recipe_name,
        recipe_url: row.recipe_url,
        recipe_ingredients_amount: row.recipe_ingredients_amount,
      });
    });
    response.send(recipes);
  } catch (err) {
    console.error(err);
  }
});

app.get("/dashboard/recipes", async (request, response) => {
  let recipes = [];
  let recipeName = request.query.recipe_name;
  let minIngredients = parseInt(request.query.min_ingredients);
  let maxIngredients = parseInt(request.query.max_ingredients);
  const userId = parseInt(request.query.user_id);
  console.log(request.query);
  if (!minIngredients) {
    minIngredients = 0;
  }
  if (!maxIngredients) {
    maxIngredients = 99999;
  }
  if (!recipeName) {
    recipeName = "";
  }
  const result = await axios
    .get("https://api.edamam.com/api/recipes/v2", {
      params: {
        type: "public",
        q: recipeName,
        app_id: process.env.APP_ID,
        app_key: process.env.APP_KEY,
        ingr: `${minIngredients}-${maxIngredients}`,
      },
    })
    .catch((err) => {
      console.error(err);
    });
  result.data.hits.forEach((double) => {
    recipes.push({
      recipe_name: double.recipe.label,
      recipe_url: double.recipe.url,
      recipe_ingredients_amount: double.recipe.ingredients.length,
      user_id: userId,
    });
  });
  console.log(recipes);
  response.send(recipes);
});

app.listen(PORT, () => {
  console.log("Server Listening on PORT:", PORT);
});
