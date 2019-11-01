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

router.get("/:id", validateActionId, (req, res, next) => {
  const action = req.action;
  res.status(200).json(action);
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
