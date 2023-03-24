const express = require("express");
const router = express.Router();
const expressfileUpload = require('express-fileupload');

const controller = require("../controllers/uploadsController");

router.use(expressfileUpload());


let routes = (app) => {
    router.post("/api/upload/:tipo/:foto", controller.retornaImagen);

    router.put("/api/upload/:tipo/:id", controller.fileUpload);

    app.use(router);
};

module.exports = routes;