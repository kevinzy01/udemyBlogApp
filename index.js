const express = require('express');
var app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

// app config
mongoose.connect("mongodb://localhost/blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"))

// mongoose model config
var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema)

// Blog.create({
//   title: "Test",
//   image: "https://images.pexels.com/photos/67636/rose-blue-flower-rose-blooms-67636.jpeg?w=1260&h=750&dpr=3&auto=compress&cs=tinysrgb",
//   body: "Test Post"
// })

// routes

// INDEX
app.get("/", (req, res) => {
  res.redirect("/blogs")
})

// NEW
app.get("/blogs/new", (req, res) => {
  res.render("create")
})

// CREATE
app.post("/blogs", (req, res) => {
  // create blog
  Blog.create(req.body.blog, function (err, newBlog) {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/blogs")
      }
  })
})

app.get("/blogs", (req, res) => {
  Blog.find({}, function (err, blogs) {
    if (err) {
      console.log(err);
    } else {
      res.render("blogs", {blogs: blogs})
    }
  })
})

// SHOW
app.get("/blogs/:id", (req, res) => {
  Blog.findById(req.params.id, function (err, foundBlog) {
    if (err) {
      res.redirect("/blogs")
    } else {
      res.render("show", {blog: foundBlog});
    }
  })
})

// EDIT
app.get("/blogs/:id/edit", (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if (err) {
      res.redirect("/blogs")
    } else {
      res.render("edit", {blog: foundBlog});
    }
  })
})

// UPDATE
app.put("/blogs/:id", (req, res) => {
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
    if (err) {
      res.redirect("/blogs")
    } else {
      res.redirect("/blogs/" + req.params.id)
    }
  })
})

// DELETE
app.delete("/blogs/:id", (req, res) => {
  Blog.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      res.redirect("/blogs")
    } else {
      res.redirect("/blogs")
    }
  })
})


app.listen("3000", function () {
  console.log("Server Started!");
})
