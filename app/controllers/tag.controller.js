const db = require("../models");
const Tutorial = db.tutorials;
const Tag = db.tag;

//create new tag
const create = (req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a tag
    const tag = {
        name: req.body.name,

    };

    // Save tag in the database
    Tag.create(tag)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Tag."
            });
        });
};

const update = (req, res) => {
    const id = req.params.id;

    Tag.update(req.body, {
            where: { id: id }
        })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Tag was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Tag with id=${id}. Maybe Tag was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Tag with id=" + id
            });
        });
};

//find all by tutorial
const findAllTags = async() => {
    try {
        return Tag.findAll({
            include: [{
                model: Tutorial,
                as: 'tutorials',
                attributes: ['id', 'title', 'description'],
                through: {
                    attributes: []
                }
            }]
        });
    } catch (err) {
        console.log(err);
    }
}

const getAll = (req, res) => {
    Tag.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving tags."
            });
        });
};
//find by id


const findTagById = async(id) => {
    try {
        return Tag.findByPk(id, {
            include: [{
                model: Tutorial,
                as: 'tutorials',
                attributes: ['id', 'title', 'description'],
                through: {
                    attributes: []
                }
            }]
        })
    } catch (err) {
        console.log(err);
    }
}

//Add a Tutorial to a Tag
const addTutorial = async(tagId, tutorialId) => {
    try {
        const tag = await Tag.findByPk(tagId);
        const tutorial = await Tutorial.findByPk(tutorialId);

        await tag.addTutorial(tutorial);

        return tag;
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    create,
    findAllTags,
    addTutorial,
    update,
    getAll,
    findTagById
};