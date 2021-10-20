const knex = require("../db/connection")

function list(){
    return knex("tables")
    .select("*")
    .orderBy("table_name")
}

function listById(id){
    return knex("reservations")
    .select("*")
    .where({reservation_id: id})
    .then((reservation)=> reservation[0])
}

function read(table_id){
    return knex("tables")
    .select("*")
    .where({table_id: table_id})
    .then((readTables)=> readTables[0])
}

async function seat(table_id, reservation_id){
    try{
        await knex.transaction(async (trx)=> {
            const table = await trx("tables")
                .select("*")
                .where({table_id})
                .update({reservation_id}, "*")
                .then((updatedRecords)=> updatedRecords[0])

                await trx("reservations")
                    .select("*")
                    .where({reservation_id: reservation_id})
                    .update({status: "seated"}, "*")

                return table;
        })
    } catch(error){
        console.error(error)
    }
}

function create(table){
    return knex("tables")
        .insert(table)
        .returning("*")
        .then((createdTables)=> createdTables[0])
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
    finish,
    create,
    listById,
    seat,
}