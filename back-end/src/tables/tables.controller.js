const service = require("./tables.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")
const hasProperties = require("../errors/hasProperties")
const reservationService = require("../reservations/reservations.service")

async function tableExists(req, res, next){
    const {table_id} = req.params;
    const data = await service.read(table_id);
    if(data){
        res.locals.table = data;
        return next()
    } else {
        return next({
            status: 404, 
            message: `table_id: ${table_id} does not exist`
        })
    }
}

async function reservationExists(req, res, next){
    const {reservation_id} = req.body.data;
    const data = await reservationService.read(reservation_id);
    if(data){
        res.locals.reservation = data
        return next()
    } else {
        return next({
            status: 400, 
            message: `reservation_id: ${reservation_id} does not exist`
        })
    }
}

function tableCapacity(req, res, next){
    const {capacity} = res.locals.table;
    const {people} = res.locals.reservation;
    if(capacity >= people){
        return next()
    } else {
        return ({
            status: 400, 
            message: "Table does not have sufficient capacity"
        })
    }
}

function tableIsFree(req, res, next){
    const {status} = res.locals.table
    if(status==="Free"){
        return next()
    } else {
        return ({
            status: 400, 
            message: "Table is occupied"
        })
    }
}

function tableIsNotOccupied(req, res, next){
    const {status} = res.locals.table
    if(status==="Occupied"){
        return next
    } else {
        return ({
            status: 400, 
            message: "Table is not occupied"
        })
    }
}

async function list(req, res) {
    res.json({data: await service.list()})
  }

async function seat(req, res){
    const {table} = res.locals
    const {reservation_id} = res.locals.reservation;
    const {table_id} = req.params;
    const data = {
        ...table,
        table_id: table_id, 
        reservation_id: reservation_id,
        status: "Occupied"
    }
    const updatedTable= await service.seat(data)
    const updatedReservation = {
        status: "seated", 
        reservation_id: reservation_id
    }
    await reservationService.update(updatedReservation)
    res.json({data: updatedTable})
}

async function finish(req, res){
    const {table} = res.locals
    const {table_id} = req.params
    const updatedData = {
        ...table,
        status: "Free"
    }
    await service.finish(updatedData)
    res.json({data: updatedTable})
}

  module.exports = {
      list: asyncErrorBoundary(list),
      seat: [
          asyncErrorBoundary(tableExists),
          asyncErrorBoundary(reservationExists),
          tableCapacity, 
          tableIsFree,
          asyncErrorBoundary(seat)
        ],
      finish: 
        [asyncErrorBoundary(tableExists),
        tableIsNotOccupied,
        asyncErrorBoundary(finish)],
  }