const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const homeStartingContent = "Welcome to the home page of the Blog from Bob's House!";
const aboutContent = "This is a blog about nothing, brought to you by Bob's House.";
const contactContent = "Bob Cunningham/nbobchm@gmail.com";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://bobchm:monkeyhead@cluster0.4c99z.mongodb.net/blogDB");

const blogSchema = new mongoose.Schema({
  title: String,
  srchTitle: String,
  content: String
});

const BlogEntry = mongoose.model("BlogEntry", blogSchema);

app.get("/", function(req, res) {

  BlogEntry.find({}, function (err, posts) {
    if (err) {
      console.log(err);
    } else {
      console.log("posts: " + posts);
      res.render("home", { 
                      homeContent: homeStartingContent,
                      posts: posts
                    });
    }
  });
})

app.get("/about", function(req, res) {
  res.render("about", {aboutContent: aboutContent});
})

app.get("/contact", function(req, res) {
  res.render("contact", {contactContent: contactContent});
})

app.get("/compose", function(req, res) {
  res.render("compose");
})

app.post("/compose", function(req, res) {
  const post = BlogEntry(({
    title: req.body.postTitle,
    srchTitle: _.lowerCase(req.body.postTitle),
    content: req.body.postContent
  }));
  post.save(function(err, postItem) {
    if (err) {
      console.log(err);
    } else {}
      res.redirect("/");
  });
  });

app.get("/posts/:name", function (req, res) {
  var srchTitle = _.lowerCase(req.params.name);
  BlogEntry.find({ srchTitle: srchTitle }, function (err, posts) {
  if (err && posts && posts.length > 0) {
    console.log(err);
  } else {
    console.log(posts);
    post = posts[0];
    res.render("post", {
                        postTitle: post.title,
                        postContent: post.content
                       });
    }
  });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started on port " + port);
});
