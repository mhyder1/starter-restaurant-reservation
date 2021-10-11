const knex = require("../db/connection")

function list(){
    return knex("tables")
    .select("*")
    .orderBy("table_name")
}

function read(table_id){
    return knex("tables")
    .select("*")
    .where({table_id: table_id})
    .then((readTables)=> readTables[0])
}

module.exports = {
    list, 
    read,
}