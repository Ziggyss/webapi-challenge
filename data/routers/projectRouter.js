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

router.get("/:id", validateProjectId, (req, res) => {
    const project = req.project;
    res.status(200).json(project);
  });

  router.post("/", (req, res) => {
    const newProject = req.body;
    Projects.insert(newProject)
      .then(project => {
        res.status(200).json({
          project,
          message: "Project successfully added"
        });
      })
      .catch(err => {
        res.status(500).json({
          message: "Something went wrong when adding the project",
          error: err.message
        });
      });
  });

  router.delete("/:id", validateProjectId, (req, res) => {
    Projects.remove(req.project.id)
      .then(() => {
        res.status(200).json({
          message: "Project successfully deleted"
        });
      })
      .catch(err => {
        res.status(500).json({
          message: `Error removing the project: ${err.message}`
        });
      });
  });
  
  function validateProjectId(req, res, next) {
    const { id } = req.params;
    Projects.get(id)
      .then(project => {
        if (project) {
          req.project = project;
          next();
        } else {
          res.status(400).json({
            message: "invalid project id"
          });
        }
      })
      .catch(err => {
        res.status(500).json({
          message: err.message
        });
      });
  }
  

module.exports = router;

