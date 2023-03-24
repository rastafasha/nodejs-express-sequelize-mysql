const express = require("express");
const router = express.Router();
const controller = require("../controllers/tag.controller");

let routes = (app) => {
    router.get("/api/tag/findAll", controller.getAll);
    router.get("/api/tag/findById", controller.findTagById);
    router.post("/api/tag/create", controller.create);
    router.put("/api/tag/update/:id", controller.update);

    app.use(router);
};

module.exports = routes;