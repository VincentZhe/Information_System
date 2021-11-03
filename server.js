/************************************************************************ *********
 * WEB700 – Assignment 04
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
 * of this assignment has been copied manually or electronically from any other source
 * (including 3rd party web sites) or distributed to other students. *
 * Name: Zhe Tian Student ID: ztian18 Date: Oct 28 2021 *
 * Online (Heroku) Link: ________________________________________________________
 * ********************************************************************************/

var HTTP_PORT = process.env.PORT || 8080;
const express = require("express");
const { get } = require("http");
var app = express();
var path = require("path");
var dataModule = require("./modules/collegeData.js");

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

app.get("/students", (req, res) => {
  if (req.query.course) {
    dataModule
      .getStudentsByCourse(req.query.course)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.json({ message: err });
      });
  } else {
    dataModule
      .getAllStudents()
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.json({ message: err });
      });
  }
});
// Get /tas
app.get("/tas", (req, res) => {
  dataModule
    .getTAs()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json({ message: err });
    });
});
// Get /courses
app.get("/courses", (req, res) => {
  dataModule
    .getCourses()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json({ message: err });
    });
});
// Get /student/num
app.get("/student/:num", (req, res) => {
  dataModule
    .getStudentByNum(req.params.num)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json({ message: err });
    });
});
// Get /
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/home.html"));
});
// Get /about
app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/about.html"));
});
// Get /htmlDemo
app.get("/htmlDemo", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/htmlDemo.html"));
});
// Get /students/add
app.get("/students/add", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/addStudent.html"));
});
// Post /students/add
app.post("/students/add", (req, res) => {
  dataModule
    .addStudent(req.body)
    .then(res.redirect("/students"))
    .catch((err) => {
      res.json({ message: err });
    });
});
// no matching route
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "/images/404Pages.png"));
});
// initialize
dataModule
  .initialize()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log("server listening on port: " + HTTP_PORT);
    });
  })
  .catch((err) => {
    console.log("There was an error" + err);
  });
