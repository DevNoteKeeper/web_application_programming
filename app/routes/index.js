var express = require("express");
var router = express.Router();
var pgp = require("pg-promise")();

var db = pgp(
  "postgres://dab_dda2526-2b_34:qjVKYu5b5X7o97qF@bronto.ewi.utwente.nl:5432/dab_dda2526-2b_34",
);

router.get("/", async function (req, res, next) {
  // res.render("index", { title: "Express" });
  // try {
  //   const data = await db.any(
  //     `SELECT g.student_id, g.grade, g.quarter, g.year, g.course_code, g.course
  //       FROM srs.grades AS g
  //       WHERE g.student_id = 1010191
  //       ORDER BY g.year ASC, g.quarter ASC`,
  //   );
  //   res.render("index", {
  //     title: "Grades of student 1010191",
  //     grades: data,
  //   });
  // } catch (err) {
  //   console.error(err);
  //   next(err);
  // }

  res.render("index", {
    title: "Student grades",
    grades: [],
    student_id: "",
    student_name: "",
  });
});

router.post("/", async function (req, res, next) {
  const student_info = req.body.student_info;

  try {
    const data = await db.any(
      `
      SELECT g.student_id, g.student, g.grade, g.quarter, g.year, g.course_code, g.course
      FROM srs.grades AS g
      WHERE g.student = $1 OR g.student_id::text = $1
      ORDER BY g.year, g.quarter
      `,
      [student_info],
    );

    res.render("index", {
      title: "Student grades",
      grades: data,
      student_info: student_info,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
