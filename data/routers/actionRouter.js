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

router.post("/", (req, res) => {
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
        message: "Something went wrong when adding the action",
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

router.put("/:id", validateActionId, (req, res) => {
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

module.exports = router;
