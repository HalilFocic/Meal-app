require("dotenv").config();
const express = require("express");
const app = express();
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

const DBLink = process.env.DB_URL || "mongodb://localhost/CookingApp";
mongoose.connect(DBLink, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}); // NewParser and UnifiedTopoloy to avoid warnings

// App setup
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
//Food Schema
var mealSchema = new mongoose.Schema({
  name: String,
  image: String,
  desc: String,
});
var Meal = mongoose.model("Meal", mealSchema);

// App routes
app.get("/", function (req, res) {
  res.render("landing");
});
app.get("/meals", function (req, res) {
  Meal.find({}, function (err, allMeals) {
    if (err) {
      console.log("ERROR!");
    } else {
      res.render("meals", { meals: allMeals });
    }
  });
});
app.get("/meals/new", function (req, res) {
  res.render("new");
});
app.post("/meals", function (req, res) {
  Meal.create(req.body.meal, function (err, newBlog) {
    if (err) {
      res.render("new");
    } else {
      res.redirect("/meals");
    }
  });
});
app.delete("/meals/:id", function (req, res) {
  Meal.findByIdAndRemove(req.params.id, function (err, updated) {
    if (err) {
      console.log("Wtf nece nesto");
    } else {
      res.redirect("/meals");
    }
  });
});
app.listen(3000, function () {
  console.log("Server has started!");
});
