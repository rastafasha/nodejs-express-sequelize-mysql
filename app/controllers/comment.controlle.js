const db = require('../models');
const Comment = db.comments;

const createComment = async(tutorialId, comment) => {
    try {
        const { name, text } = comment;

        return Comment.create({ name, text, tutorialId });
    } catch (err) {
        console.log(err);
    }
}

const findCommentById = async(id) => {
    try {
        return Comment.findByPk(id, { include: ['tutorial'] });
    } catch (err) {
        console.log(err);
    }
}

const findAllComments = async() => {
    try {
        return Comment.findAll({ include: ['tutorial'] })
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    createComment,
    findCommentById,
    findAllComments



}