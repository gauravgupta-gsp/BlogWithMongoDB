//jshint esversion:6
require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");

const mongoDbURL = "mongodb://localhost:27017/blogDB";
const urlAtlas = "mongodb+srv://"+process.env.DB_USER+":"+process.env.DB_PASSWORD+"@cluster0-4uxnp.mongodb.net/blogDB?retryWrites=true&w=majority";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


mongoose.connect(urlAtlas, {useNewUrlParser: true,useUnifiedTopology: true, useFindAndModify: false });

let db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error"));
db.once("open", function () {
  console.log("Successfully connected to DB");
});

const homeStartingContent = "Hi I am Gaurav Gupta. I am a Scrum Master with experience in full stack web development. I love to apply Scrum values in my day to day life.  I have keen interest in development and want to polish my skills as a programmer. In coming future i want to focus more on DevOps.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
const aboutContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";



const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);


app.get("/", function(req, res){

  Post.find({}, (err, foundPosts) => {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: foundPosts
    });

  });

});

app.get("/about", (req,res) => {
  res.render("about",{pageTitle:"About", pageContent:aboutContent});
});

app.get("/contact", (req,res) => {
  res.render("contact",{pageTitle:"Contact", pageContent:contactContent});
});

app.get("/compose", (req,res) => {
  res.render("compose",{pageTitle:"Compose"});
});




app.post("/compose", (req,res) => {
  var postTitle = req.body.postTitle;
  var postContent = req.body.postContent;

  const post = new Post ({
    title:postTitle,
    content:postContent
  });
  post.save((err, post ) => {
    if ( !err) {
      res.redirect("/");
    }
  });


});

app.get("/posts/:postId", (req, res) => {
  const requestedPostId =req.params.postId;

  Post.findOne({_id:requestedPostId}, (err, post) => {
    console.log("Post from DB " + post);
    res.render("post", {searchedPost:post});
  });

});





app.listen(3000, function() {
  console.log("Server started on port 3000");
});
