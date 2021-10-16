//const { select } = require("../db/connection")
const knex = require("../db/connection")

function read(id){
    return knex("reservations")
    .select("*")
    .where({reservation_id: Number(id)})
    .then((result)=> result[0])
}


function list(date, mobile_number){
    if(date){
        return knex("reservations")
        .select("*")
        .where({reservation_date: date})
        .orderBy("reservation_time", "asc")
    }

    if(mobile_number){
        return knex("reservations")
        .select("*")
        .where("mobile_number", "like", `${mobile_number}%`)
    }
    return knex("reservations")
    .select("*")
}

function search(mobile_number) {
    return knex("reservations")
      .whereRaw(
        "translate(mobile_number, '() -', '') like ?",
        `%${mobile_number.replace(/\D/g, "")}%`
      )
      .orderBy("reservation_date");
  }

function create(reservation){
    return knex("reservations")
    .insert(reservation)
    .returning("*")
    .then((createdReservations) => createdReservations[0])
}

function update(updatedReservation){
    return knex("reservations")
    .select("*")
    .where({reservation_id: updatedReservation.reservation_id})
    .update(updatedReservation, "*")
    .then((updatedRecords)=> updatedRecords[0])
}

// function updateStatus(reservation_id, status){
//     return knex("reservations")
//         .where({reservation_id})
//         .update({status}, "*")
// }

module.exports = {
    list,
    create,
    read,
    update,
    search,
    //updateStatus,
}