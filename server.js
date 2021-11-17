/*********************************************************************************
 * WEB700 – Assignment 05
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
 * of this assignment has been copied manually or electronically from any other source
 * (including 3rd party web sites) or distributed to other students. *
 * Name: Zhe Tian Student ID: ztian18, 107103210 Date: Nov. 8 2021 *
 * Online (Heroku) Link: ________________________________________________________
 * ********************************************************************************/

var HTTP_PORT = process.env.PORT || 8080;
const express = require("express");

const exphbs = require("express-handlebars");
var app = express();
var path = require("path");
var dataModule = require("./modules/collegeData.js");

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

app.engine(
  ".hbs",
  exphbs({
    extname: ".hbs",
    defaultLayout: "main",
    helpers: {
      navLink: function (url, options) {
        return (
          "<li" +
          (url == app.locals.activeRoute
            ? ' class="nav-item active" '
            : ' class="nav-item" ') +
          '><a class="nav-link" href="' +
          url +
          '">' +
          options.fn(this) +
          "</a></li>"
        );
      },
      equal: function (lvalue, rvalue, options) {
        if (arguments.length < 3)
          throw new Error("Handlebars Helper equal needs 2 parameters");
        if (lvalue != rvalue) {
          return options.inverse(this);
        } else {
          return options.fn(this);
        }
      },
    },
  })
);
app.set("view engine", ".hbs");

app.use(function (req, res, next) {
  let route = req.baseUrl + req.path;
  app.locals.activeRoute = route == "/" ? "/" : route.replace(/\/$/, "");
  next();
});

app.get("/students", (req, res) => {
  if (req.query.course) {
    dataModule
      .getStudentsByCourse(req.query.course)
      .then((data) => {
        res.render("students", {
          students: data,
        });
      })
      .catch((err) => {
        res.render("students", {
          message: "no results",
        });
      });
  } else {
    dataModule
      .getAllStudents()
      .then((data) => {
        res.render("students", {
          students: data,
        });
      })
      .catch((err) => {
        res.render("students", {
          message: "no results",
        });
      });
  }
});
// Get /tas
// app.get("/tas", (req, res) => {
//   dataModule
//     .getTAs()
//     .then((data) => {
//       res.json(data);
//     })
//     .catch((err) => {
//       res.json({ message: err });
//     });
// });
// Get /courses
app.get("/courses", (req, res) => {
  dataModule
    .getCourses()
    .then((data) => {
      res.render("courses", {
        courses: data,
      });
    })
    .catch((err) => {
      res.render("courses", {
        message: "no results",
      });
    });
});
// Get /course/Id
app.get("/course/:Id", (req, res) => {
  dataModule
    .getCourseById(req.params.Id)
    .then((data) => {
      res.render("course", { course: data });
    })
    .catch((err) => {
      res.render("course", {
        message: "no results",
      });
    });
});
// Get /student/num
app.get("/student/:studentNum", (req, res) => {
  dataModule
    .getStudentByNum(req.params.studentNum)
    .then((data) => {
      res.render("student", { student: data });
    })
    .catch((err) => {
      res.json({ message: err });
    });
});
// Get /
app.get("/", (req, res) => {
  res.render("home");
});
// Get /about
app.get("/about", (req, res) => {
  res.render("about");
});
// Get /htmlDemo
app.get("/htmlDemo", (req, res) => {
  res.render("htmlDemo");
});
// Get /students/add
app.get("/students/add", (req, res) => {
  res.render("addStudent");
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
// Post /student/update
app.post("/student/update", (req, res) => {
  dataModule
    .updateStudent(req.body)
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
