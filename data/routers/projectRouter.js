const express = require("express");
const Projects = require("../helpers/projectModel");

const router = express.Router();

router.get("/", (req, res) => {
 Projects.get()
    .then(projects => {
      res.status(200).json({
        projects,
        message: "Projects received"
      });
    })
    .catch(err => {
      res.status(500).json({
        message: err.message
      });
    });
});

module.exports = router;

