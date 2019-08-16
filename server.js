var fs = require("fs");
var path = require("path");
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var esprima = require("esprima");
var callGraph = require("./src/callGraph");
var multer = require("multer");
var upload = multer({ dest: "uploads/" });
var handler = upload.single("file");

app.set("port", process.env.PORT || 3000);

app.use("/", express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Additional middleware which will set headers that we need on each request.
app.use(function(req, res, next) {
  // Set permissive CORS header - this allows this server to be used only as
  // an API server in conjunction with something like webpack-dev-server.
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Disable caching so we'll always get the latest comments.
  res.setHeader("Cache-Control", "no-cache");
  next();
});

app.get("/", function(req, res) {
  res.render("index", { title: "Javascript Explorer" });
});

app.post("/upload", handler, function(req, res, next) {
  callGraph(req.file.path, function(response) {
    res.json(response);
  });
});

app.listen(app.get("port"), function() {
  console.log("Server started: http://localhost:" + app.get("port") + "/");
});
