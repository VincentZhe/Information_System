/*********************************************************************************
 * WEB700 – Assignment 06
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
 * of this assignment has been copied manually or electronically from any other source
 * (including 3rd party web sites) or distributed to other students. *
 * Name: Zhe Tian Student ID: ztian18, 107103210 Date: Nov. 24 2021 *
 * Online (Heroku) Link: https://morning-ridge-23277.herokuapp.com/
 * ********************************************************************************/

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

var HTTP_PORT = process.env.PORT || 8080;

app.get("/students", (req, res) => {
  if (req.query.course) {
    dataModule
      .getStudentsByCourse(req.query.course)
      .then((data) => {
        if (data.length > 0) {
          res.render("students", {
            students: data,
          });
        } else {
          res.render("students", { message: "no results" });
        }
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
        if (data.length > 0) {
          res.render("students", {
            students: data,
          });
        } else {
          res.render("students", { message: "no results" });
        }
      })
      .catch(() => {
        res.render("students", {
          message: "no results",
        });
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
      if (data.length > 0) {
        res.render("courses", {
          courses: data,
        });
      } else {
        res.render("courses", { message: "no results" });
      }
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
      if (data == undefined) {
        res.status(404).send("Course Not Found");
      } else {
        res.render("course", { course: data });
      }
    })
    .catch((err) => {
      res.render("course", {
        message: "no results",
      });
    });
});
// Get /student/num
app.get("/student/:studentNum", (req, res) => {
  let viewData = {};
  dataModule
    .getStudentByNum(req.params.studentNum)
    .then((data) => {
      if (data) {
        viewData.student = data;
      } else {
        viewData.student = null;
      }
    })
    .catch(() => {
      viewData.student = null;
    })
    .then(dataModule.getCourses)
    .then((data) => {
      viewData.courses = data;
      for (let i = 0; i < viewData.courses.length; i++) {
        if (viewData.courses[i].courseId == viewData.student.course) {
          viewData.courses[i].selected = true;
        }
      }
    })
    .catch(() => {
      viewData.courses = [];
    })
    .then(() => {
      if (viewData.student == null) {
        res.status(404).send("Student Not Found");
      } else {
        res.render("student", { viewData: viewData });
      }
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
app.get("/students/add/", (req, res) => {
  dataModule
    .getCourses()
    .then((data) => res.render("addStudent", { courses: data }))
    .catch((err) => {
      res.render("addStudent", { courses: [] });
    });
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
// Add course
app.get("/courses/add", (req, res) => {
  res.render("addCourse");
});
// Post course
app.post("/courses/add", (req, res) => {
  dataModule
    .addCourse(req.body)
    .then(res.redirect("/courses"))
    .catch((err) => res.json({ message: err }));
});
// Update Course
app.post("/course/update", (req, res) => {
  dataModule
    .updateCourse(req.body)
    .then(res.redirect("/courses"))
    .catch((err) => {
      res.json({ message: err });
    });
});
// Delete Course By Id
app.get("/course/delete/:id", (req, res) => {
  dataModule
    .deleteCourse(req.params.id)
    .then(() => res.render("/courses"))
    .catch((err) =>
      res
        .status(500)
        .json({ message: "Unable to Remove Course/Course not found" })
    );
});
// Delete specific student
app.get("/student/delete/:studentNum", (req, res) => {
  dataModule
    .deleteStudentByNum(req.params.studentNum)
    .then(() => res.redirect("/students"))
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Unable to Remove Student/Student not found" });
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
