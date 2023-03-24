const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/test/all", controller.allAccess);

    app.get(
        "/api/test/user", [authJwt.verifyToken],
        controller.userBoard
    );

    app.get(
        "/api/test/mod", [authJwt.verifyToken, authJwt.isModerator],
        controller.moderatorBoard
    );

    app.get(
        "/api/test/admin", [authJwt.verifyToken, authJwt.isAdmin],
        controller.adminBoard
    );
    app.get(
        "/api/users", [authJwt.verifyToken, authJwt.isAdmin],
        controller.findAll
    );

    app.get(
        "/api/user/:id", [authJwt.verifyToken, authJwt.isAdmin],
        controller.findOne
    );
    app.put(
        "/api/user/update/:id", [authJwt.verifyToken, authJwt.isAdmin],
        controller.update
    );
    app.delete(
        "/api/user/delete/:id", [authJwt.verifyToken, authJwt.isAdmin],
        controller.delete
    );
};