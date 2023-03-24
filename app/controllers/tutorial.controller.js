const db = require("../models");
const Tutorial = db.tutorials;
const Op = db.Sequelize.Op;
const Comment = db.comments;
const Tag = db.tag;
const tagController = require('../controllers/tag.controller');
const commentController = require('../controllers/comment.controlle');

// Create and Save a new Tutorial
exports.create = (req, res) => {
    // Validate request
    if (!req.body.title) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a Tutorial
    const tutorial = {
        title: req.body.title,
        description: req.body.description,
        published: req.body.published ? req.body.published : false
    };

    // Save Tutorial in the database
    Tutorial.create(tutorial)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Tutorial."
            });
        });
};

// Retrieve search
exports.search = (req, res) => {
    const title = req.query.title;
    var condition = title ? {
        title: {
            [Op.like]: `%${title}%`
        }
    } : null;

    Tutorial.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving tutorials."
            });
        });
};

// Retrieve all Tutorials from the database.
exports.getAll = (req, res) => {
    Tutorial.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving tutorials."
            });
        });
};


// Find a single Tutorial with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Tutorial.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find Tutorial with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Tutorial with id=" + id
            });
        });
};



// Update a Tutorial by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Tutorial.update(req.body, {
            where: { id: id }
        })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Tutorial was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Tutorial with id=" + id
            });
        });
};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Tutorial.destroy({
            where: { id: id }
        })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Tutorial was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Tutorial with id=" + id
            });
        });
};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
    Tutorial.destroy({
            where: {},
            truncate: false
        })
        .then(nums => {
            res.send({ message: `${nums} Tutorials were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all tutorials."
            });
        });
};

// find all published Tutorial
exports.findAllPublished = (req, res) => {
    Tutorial.findAll({ where: { published: true } })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving tutorials."
            });
        });
};



//by Tags

//Retrieve all Tutorials
exports.findAllTutorialTags = () => {
    return Tutorial.findAll({
            include: [{
                model: Tag,
                as: "tags",
                attributes: ["id", "name"],
                through: {
                    attributes: [],
                },
                // through: {
                //   attributes: ["tag_id", "tutorial_id"],
                // },
            }, ],
        })
        .then((tutorials) => {
            return tutorials;
        })
        .catch((err) => {
            console.log(">> Error while retrieving Tutorials: ", err);
        });
};
//Get the Tutorial for a given tutorial id
exports.findTagById = async(req, res, next) => {
    try {
        const { id } = req.params;

        const data = await tagController.findTagById(id);

        return res.send(data);
    } catch (err) {
        next(err);
    }
};



exports.createTag = async(req, res, next) => {
    try {
        const { tagName, title, description } = req.body;

        const tutorials = await Tutorial.create({ title, description });
        const tags = await Tag.create({ name: tagName });

        await tagController.addTutorial(tags.id, tutorials.id);

        return res.send({
            message: 'success',
            tutorials
        });
    } catch (err) {
        next(err);
    }
}


//coments

exports.createComment = async(req, res, next) => {
    try {
        const { name, text, tutorialId } = req.body;

        const comment = await commentController.createComment(tutorialId, { name, text });

        return res.send(comment);
    } catch (err) {
        next(err);
    }
}

exports.findCommentById = async(req, res, next) => {
    try {
        const { id } = req.params;

        const comments = await commentController.findCommentById(id);

        return res.send(comments);
    } catch (err) {
        next(err);
    }
}

exports.findAllComments = async(req, res, next) => {
    try {
        const comments = await commentController.findAllComments();

        return res.send(comments);
    } catch (err) {
        next(err);
    }
}