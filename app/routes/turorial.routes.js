module.exports = app => {
    const tutorials = require("../controllers/tutorial.controller.js");
    const tagController = require('../controllers/tag.controller');

    var router = require("express").Router();

    // Create a new Tutorial
    router.post("/create", tutorials.create);

    // search
    router.get("/search?title=[kw]", tutorials.search);

    // Retrieve all Tutorials
    router.get("/findAll", tutorials.getAll);

    // Retrieve all published Tutorials
    router.get("/published", tutorials.findAllPublished);

    // Retrieve a single Tutorial with id
    router.get("/findOne/:id", tutorials.findOne);

    // Update a Tutorial with id
    router.put("/update/:id", tutorials.update);

    // Delete a Tutorial with id
    router.delete("/delete/:id", tutorials.delete);

    // Delete all Tutorials
    router.delete("/deleteAll", tutorials.deleteAll);

    //tags
    router.post("/createtag", tutorials.createTag);

    router.get("/findTagById/:id", tutorials.findTagById);

    //coments
    router.post('/createcomment', tutorials.createComment);

    router.get('/comments', tutorials.findAllComments);

    router.get('/comments/:id', tutorials.findCommentById);





    app.use('/api/tutorials', router);
};