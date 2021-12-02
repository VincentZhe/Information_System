// const fs = require("fs");
// const { resolve } = require("path");

// class Data {
//   constructor(students, courses) {
//     this.students = students;
//     this.courses = courses;
//   }
// }

// var dataCollection = null;

const Sequelize = require("sequelize");
var connection1 = new Sequelize(
  "d9r34jd827u7np",
  "vzkrhrqqovaevc",
  "3d9f9ab57028c62ca6ee3d931942f7cc4a552d87f44eb0f9d1e6a5d30bc33151",
  {
    host: "ec2-3-224-112-203.compute-1.amazonaws.com",
    dialect: "postgres",
    port: 5432,
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
    query: { raw: true },
  }
);

let Student = connection1.define("Student", {
  studentNum: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  email: Sequelize.STRING,
  addressStreet: Sequelize.STRING,
  addressCity: Sequelize.STRING,
  addressProvince: Sequelize.STRING,
  TA: Sequelize.BOOLEAN,
  status: Sequelize.STRING,
});

let Course = connection1.define("Course", {
  courseId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  courseCode: Sequelize.STRING,
  courseDescription: Sequelize.STRING,
});

Course.hasMany(Student, { foreignKey: "course" });

module.exports.initialize = function () {
  return new Promise(function (resolve, reject) {
    connection1
      .sync()
      .then(() => {
        resolve("success");
      })
      .catch((err) => {
        reject("Unable to sync the database");
      });
  });
};

// Build getAllStudents()
module.exports.getAllStudents = function () {
  return new Promise(function (resolve, reject) {
    Student.findAll({
      order: ["studentNum"],
    })
      .then((allStudent) => resolve(allStudent))
      .catch((err) => reject("no results returned"));
  });
};
//Build getTAs()
module.exports.getTAs = function () {
  return new Promise(function (resolve, reject) {
    Student.findAll({
      where: { TA: true },
    })
      .then((allTAs) => resolve(allTAs))
      .catch((err) => reject("no results returned"));
  });
};
//Build getCourses()
module.exports.getCourses = function () {
  return new Promise(function (resolve, reject) {
    Course.findAll()
      .then((allCourses) => resolve(allCourses))
      .catch((err) => reject("no results returned"));
  });
};
// Build GetStudentsByCourse
module.exports.getStudentsByCourse = function (course) {
  return new Promise((resolve, reject) => {
    Student.findAll({
      where: { course: course },
    })
      .then((specificStudents) => resolve(specificStudents))
      .catch((err) => reject("no results returned"));
  });
};
// Build GetStudentsByNum
module.exports.getStudentByNum = function (num) {
  return new Promise((resolve, reject) => {
    Student.findAll({
      where: {
        studentNum: num,
      },
    })
      .then((studentByNum) => resolve(studentByNum[0]))
      .catch((err) => reject("no results returned"));
  });
};
// Build addStudent function
module.exports.addStudent = function (studentsData) {
  for (const prop in studentsData) {
    if (prop == "") {
      studentsData.prop = null;
    }
  }
  studentsData.TA = studentsData.TA ? true : false;
  return new Promise((resolve, reject) => {
    Student.create(studentsData)
      .then((newStudent) => resolve(newStudent))
      .catch((err) => reject("unable to create student"));
  });
};
// Build getCourseById function
module.exports.getCourseById = function (id) {
  return new Promise((resolve, reject) => {
    Course.findAll({
      where: {
        courseId: id,
      },
    })
      .then((courseById) => resolve(courseById[0]))
      .catch((err) => reject("no results returned"));
  });
};

// Build updateStudent
module.exports.updateStudent = function (studentData) {
  for (const prop in studentData) {
    if (prop == "") {
      studentData.prop = null;
    }
  }
  studentData.TA = studentData.TA ? true : false;
  return new Promise((resolve, reject) => {
    Student.update(studentData, {
      where: {
        studentNum: studentData.studentNum,
      },
    })
      .then(() => resolve())
      .cathc((err) => reject("unable to update student"));
  });
};

module.exports.addCourse = function (courseData) {
  for (const prop in courseData) {
    if (prop == "") {
      courseData.prop = null;
    }
  }
  return new Promise((resolve, reject) => {
    Course.create(courseData)
      .then(() => resolve())
      .catch((err) => reject("unable to create course"));
  });
};

module.exports.updateCourse = function (courseData) {
  for (const prop in courseData) {
    if (prop == "") {
      courseData.prop = null;
    }
  }
  return new Promise((resolve, reject) => {
    Course.update(courseData, {
      where: {
        courseId: courseData.courseId,
      },
    })
      .then(() => resolve())
      .catch((err) => reject("unable to update course"));
  });
};

module.exports.deleteCourse = function (id) {
  return new Promise((resolve, reject) => {
    Course.destroy({
      where: {
        courseId: id,
      },
    })
      .then(() => "course deleted")
      .catch((err) => reject("unable to delete this course"));
  });
};

module.exports.deleteStudentByNum = function (studentNum) {
  return new Promise((resolve, reject) => {
    Student.destroy({
      where: {
        studentNum: studentNum,
      },
    })
      .then(() => resolve("student deleted"))
      .catch((err) => reject("no student found"));
  });
};
