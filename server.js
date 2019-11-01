const express = require("express");

const actionRouter = require("./data/routers/actionRouter");
const projectRouter = require("./data/routers/projectRouter");

const server = express();

server.use(express.json());
server.use('/actions', actionRouter);
server.use('/projects', projectRouter);

server.get("/", (req, res) => {
  res.send(`<h2>Testing, testing...</h2>`);
});

module.exports = server;
