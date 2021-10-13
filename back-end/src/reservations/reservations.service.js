//const { select } = require("../db/connection")
const knex = require("../db/connection")

function read(id){
    return knex("reservations")
    .select("*")
    .where({reservation_id: Number(id)})
    .then((result)=> result[0])
}

function list(){
    return knex("reservations")
    .select("*")
    .orderBy("reservation_date")
    .orderBy("reservation_time");
}

function listByDate(date){
    return knex("reservations")
        .select("*")
        .where({reservation_date: date})
        .orderBy("reservation_time")
}

function create(reservation){
    return knex("reservations")
    .insert(reservation)
    .returning("*")
}

function update(updatedReservation){
    return knex("reservations")
    .select("*")
    .where({reservation_id: updatedReservation.reservation_id})
    .update(updatedReservation, "*")
    .then((updatedReservations)=> updatedReservations[0])
}

module.exports = {
    list,
    listByDate,
    create,
    read,
    update,
}