const service = require("./tables.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")
const hasProperties = require("../errors/hasProperties")
const reservationService = require("../reservations/reservations.service")
const hasOnlyValidProperties = require("../errors/hasOnlyValidProperties")

const VALID_PROPERTIES = [
    "table_name",
    "capacity"
]

const VALID_PROPERTIES_FOR_PUT = [
    "reservation_id"
]

const hasRequiredProperties = hasProperties(
    "table_name",
    "capacity"
)

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
    const data = await reservationService.read(reservation_id)
    console.log({data}, 'reservationExists')
    if(data && data.status !=="seated"){
        res.locals.reservation = data;
        return next()
    }
    else if(data && data.status==="seated"){
        return next({
            status: 400, 
            message: `reservation_id: ${reservation_id} has already been seated`
        })
    } else {
        return next({
            status: 404, 
            message: `reservation_id: ${reservation_id} does not exist.`
        })
    }
}

function sufficientCapacity(req, res, next){
    console.log(res.locals, "+++++++++++++++++++++++++++++++++")
    const {capacity} = res.locals.table;
    const {people} = res.locals.reservation;
    if(capacity >= people){
        next();
    }
    else{
        return next({
            status: 400,
            message: `Table does not have suffience capacity to seat full party`
        })
    }
}

function nameMoreThanOneCharacter(req,res, next){
    const {table_name} = req.body.data
    if(table_name.length <= 1){
        return next({
            status: 400, 
            message: `table_name must be at least 2 characters long`
        })
    }
    next();
}

function capacityANumber(req, res, next){
    const {capacity} = req.body.data;
    if(Number.isInteger(capacity) && capacity >= 1){
        return next()
    } else {
        return next({
            status: 400, 
            message: `capacity field not formatted correctly. ${capacity} must be a number`
        })
    }
}


function tableIsFree(req, res, next){
    console.log(res.locals, 'tableIsFree--------------------')
    const {status} = res.locals.table
    
    if(status==="free"){
        return next()
    } else {
        return next({
            status: 400, 
            message: "Table is occupied"
        })
    }
}
//
function tableIsOccupied(req, res, next){
    const {status} = res.locals.table
    console.log({status})
    if(status==="Occupied"){
        return next();
    } else {
        return next({
            status: 400, 
            message: "Table is not occupied"
        })
    }
}
//

async function list(req, res) {
    res.json({data: await service.list()})
  }

// async function update(req, res){
//     const {table} = res.locals
//     const {reservationId} = res.locals.reservation;
//     const {table_id} = req.params;
//     const data = {
//         ...table,
//         table_id: table_id, 
//         reservation_id: reservationId,
//         status: "Occupied"
//     }
//     const updatedTable= await service.update(data)
//     const updatedReservation = {
//         status: "seated", 
//         reservation_id: reservationId
//     }
//     await reservationService.update(updatedReservation)
//     res.status(200).json({data: updatedTable})
// }

async function update(req, res){
    console.log(res.locals,' @@@@@@@@@@@@@@@@@@@@@@@@@@@@')
    const {reservation_id} = res.locals.reservation;
    console.log(reservation_id)
    const updatedTable = {...res.locals.table, reservation_id}
    const data = await service.seat(updatedTable.table_id, reservation_id)
    console.log({data}, '****************************')
    res.status(200).json({data})
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

async function create(req, res){
    const data = await service.create(req.body.data)
    res.status(201).json({data})
}

  module.exports = {
    list: asyncErrorBoundary(list),
    seat: [
        hasProperties(...VALID_PROPERTIES_FOR_PUT),
        hasOnlyValidProperties(...VALID_PROPERTIES_FOR_PUT),
        asyncErrorBoundary(reservationExists),
        asyncErrorBoundary(tableExists),
        sufficientCapacity,
        tableIsFree,
        
        asyncErrorBoundary(update)
        ],
    finish: 
        [
        asyncErrorBoundary(tableExists),
        tableIsOccupied,
        asyncErrorBoundary(finish)],
    create: [
          hasOnlyValidProperties(...VALID_PROPERTIES),
          hasRequiredProperties,
          nameMoreThanOneCharacter,
          capacityANumber,
          asyncErrorBoundary(create)
        ]
  }