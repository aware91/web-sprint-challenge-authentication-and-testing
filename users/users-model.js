const db = require("../database/dbConfig.js");

module.exports = {
    findAll,
    findBy,
    findById,
    add
}

function findAll() {
    return db("users");
}

function findBy(filter) {
    return db("users").where(filter).first();
}

function findById(id) {
    return db("users").where({id: id}).first();
}

function add(user) {
    return db("users").insert(user).then(ids => findById(ids[0]));
}