const knex = require('../db/connection');

function create(newTable) {
  return knex('tables').insert(newTable).returning('*');
}

function list() {
  return knex('tables').select('*').orderBy('table_name');
}

function update({ table_id, reservation_id }) {
  return knex.transaction((trx) => {
    return knex('reservations')
      .transacting(trx)
      .where({ reservation_id: reservation_id })
      .update({ status: 'seated' })
      .then(() => {
        return knex('tables')
          .where({ table_id: table_id })
          .update({ reservation_id: reservation_id })
          .returning('*');
      })
      .then(trx.commit)
      .catch(trx.rollback);
  });
}

function read(table_id) {
  return knex('tables').select('*').where({ table_id: table_id }).first();
}

function finish(table_id, reservation_id) {
  return knex.transaction((trx) => {
    return knex('reservations')
      .transacting(trx)
      .where({ reservation_id: reservation_id })
      .update({ status: 'finished' })
      .returning('*')
      .then(() => {
        return knex('tables')
          .where({ table_id: table_id })
          .update({ reservation_id: null })
          .returning('*');
      })
      .then(trx.commit)
      .catch(trx.rollback);
  });
}

module.exports = {
  create,
  list,
  read,
  update,
  finish,
};
// const knex = require("../db/connection")

// function list(){
//     return knex("tables")
//     .select("*")
//     .orderBy("table_name")
// }

// // function listById(id){
// //     return knex("reservations")
// //     .select("*")
// //     .where({reservation_id: id})
// //     .then((reservation)=> reservation[0])
// // }

// function read(table_id){
//     return knex("tables")
//     .select("*")
//     .where({table_id})
//     .first()
// }

// function readRes(reservation_id) {
//     return knex("reservations")
//       .select("*")
//       .where({ reservation_id: reservation_id })
//       .first();
//   }

//  function updateReservation(reservation_id, status){
//     return knex("reservations")
//         .where({reservation_id: reservation_id})
//         .update({status: status}) 
//  }
    

//  function occupyTable(table_id, reservation_id){
//     return knex("tables")
//         .where({table_id: table_id})
//         .update({reservation_id:reservation_id, status: "occupied"})
//  }

// function freeTable(table_id){
//     return knex("tables")
//     .where({table_id: table_id})
//     .update({reservation_id: null, status: "free"})
// }

// function create(table){
//     return knex("tables")
//         .insert(table)
//         .returning("*")
// }

// function finish(updatedTable){
//     return knex("tables")
//     .select("*")
//     .where({table_id: updatedTable.table_id})
//     .update(updatedTable, "*")
//     .then((updatedTables)=> updatedTables[0])
// }

// module.exports = {
//     list, 
//     read,
//     readRes,
//     finish,
//     create,
//     occupyTable,
//     freeTable,
//     updateReservation,
// }