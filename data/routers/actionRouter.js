const express = require("express");
const Actions = require("../helpers/actionModel");

const router = express.Router();

router.get("/", (req, res) => {
  Actions.get()
    .then(actions => {
      res.status(200).json({
        actions,
        message: "Actions received"
      });
    })
    .catch(err => {
      res.status(500).json({
        message: err.message
      });
    });
});

router.get("/:id", validateActionId, (req, res) => {
  const action = req.action;
  res.status(200).json(action);
});

router.post("/", validateActionInfo, (req, res) => {
  const newAction = req.body;
  Actions.insert(newAction)
    .then(action => {
      res.status(200).json({
        action,
        message: "Action successfully added"
      });
    })
    .catch(err => {
      res.status(500).json({
        message:
          "Something went wrong when adding the action. Please check that there is a valid project ID",
        error: err.message
      });
    });
});

router.delete("/:id", validateActionId, (req, res) => {
  Actions.remove(req.action.id)
    .then(() => {
      res.status(200).json({
        message: "Action successfully deleted"
      });
    })
    .catch(err => {
      res.status(500).json({
        message: `Error removing the action: ${err.message}`
      });
    });
});

router.put("/:id", [validateActionId, validateActionInfo], (req, res) => {
  const { id } = req.params;
  const updatedAction = req.body;
  Actions.update(id, updatedAction)
    .then(action => {
      res.status(200).json({
        message: "Action successfully updated",
        action
      });
    })
    .catch(err => {
      res.status(500).json({
        message: "Error updating the action",
        error: err.message
      });
    });
});

function validateActionId(req, res, next) {
  const { id } = req.params;
  Actions.get(id)
    .then(action => {
      if (action) {
        req.action = action;
        next();
      } else {
        res.status(400).json({
          message: "invalid id"
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        message: err.message
      });
    });
}

function validateActionInfo(req, res, next) {
  if (!Object.keys(req.body).length) {
    res.status(400).json({
      message: "Please provide more information about your action"
    });
  } else if (!req.body.project_id) {
    res.status(400).json({
      message: "Please provide a project ID for your action"
    });
  } else if (!req.body.description) {
    res.status(400).json({
      message: "Please provide a description for your action"
    });
  } else if (!req.body.notes) {
    res.status(400).json({
      message: "Please provide notes for your action"
    });
  } else {
    next();
  }
}

module.exports = router;
