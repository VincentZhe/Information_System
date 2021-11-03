const fs = require("fs");
const { resolve } = require("path");

class Data {
  constructor(students, courses) {
    this.students = students;
    this.courses = courses;
  }
}

var dataCollection = null;

module.exports.initialize = function () {
  return new Promise(function (resolve, reject) {
    fs.readFile("./data/students.json", "utf-8", function (err, studentsdata) {
      if (err) {
        reject("unable to read students.json");
        return;
      }

      // Once the students data loaded, then starts with courses data
      fs.readFile("./data/courses.json", "utf-8", function (err, coursesdata) {
        if (err) {
          reject("unable to read courses.json");
          return;
        }
        dataCollection = new Data(
          JSON.parse(studentsdata),
          JSON.parse(coursesdata)
        );
        resolve();
      });
    });
  });
};

// Build getAllStudents()
module.exports.getAllStudents = function () {
  return new Promise(function (resolve, reject) {
    if (dataCollection.students.length == 0) {
      reject("no results returned");
    }
    resolve(dataCollection.students);
  });
};
//Build getTAs()
module.exports.getTAs = function () {
  return new Promise(function (resolve, reject) {
    var filteredStudents = [];
    for (let i = 0; i < dataCollection.students.length; i++) {
      if (dataCollection.students[i].TA) {
        filteredStudents.push(dataCollection.students[i]);
      }
    }

    if (filteredStudents.length == 0) {
      reject("no results returned");
    }
    resolve(filteredStudents);
  });
};
//Build getCourses()
module.exports.getCourses = function () {
  return new Promise(function (resolve, reject) {
    if (dataCollection.courses.length == 0) {
      reject("no results returned");
    }
    resolve(dataCollection.courses);
  });
};
// Build GetStudentsByCourse
module.exports.getStudentsByCourse = function (course) {
  var studentsByCourse = [];
  return new Promise((resolve, reject) => {
    for (let i = 0; i < dataCollection.students.length; i++) {
      if (dataCollection.students[i].course == course) {
        studentsByCourse.push(dataCollection.students[i]);
      }
    }
    if (studentsByCourse.length == 0) reject("no results returned");
    resolve(studentsByCourse);
  });
};
// Build GetStudentsByNum
module.exports.getStudentByNum = function (num) {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < dataCollection.students.length; i++) {
      if (dataCollection.students[i].studentNum == num) {
        resolve(dataCollection.students[i]);
      }
    }
    if (!dataCollection.studetns[i]) {
      reject("no results returned");
    }
  });
};
// Build addStudent function
module.exports.addStudent = function (studentsData) {
  return new Promise((resolve, reject) => {
    if (studentsData.TA == undefined) {
      studentsData.TA = false;
    } else {
      studentsData.TA = true;
    }
    studentsData.studentNum = dataCollection.students.length + 1;

    dataCollection.students.push(studentsData);

    resolve();
  });
};
