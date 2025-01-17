const { Router } = require("express");

const Controller = require("./Controller");

const routes = Router();

routes.get("/", Controller.index);

module.exports = routes;