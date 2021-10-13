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

function seat(updatedTable){
    return knex("tables")
    .select("*")
    .where({table_id: updatedTable.table_id})
    .update(updatedTable, "*")
    .then((updatedTables)=> updatedTables[0])
}

function finish(updatedTable){
    return knex("tables")
    .select("*")
    .where({table_id: updatedTable.table_id})
    .update(updatedTable, "*")
    .then((updatedTables)=> updatedTables[0])
}

module.exports = {
    list, 
    read,
    seat,
    finish,
}