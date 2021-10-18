const service = require('./tables.service');
const hasProperties = require('../errors/hasProperties');
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');
const {read} = require('../reservations/reservations.service');

const VALID_PROPERTIES = ['table_name', 'capacity', 'reservation_id'];

function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;
  const invalidFields = Object.keys(data).filter((field) => {
    !VALID_PROPERTIES.includes(field);
  });
  if (invalidFields.length)
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(',')}`,
    });
  next();
}

const hasRequiredProperties = hasProperties('table_name', 'capacity');

const hasRequiredUpdateProperties = hasProperties('reservation_id');

function hasValidTableName(req, res, next) {
  const { table_name } = req.body.data;
  if (table_name.length < 2) {
    return next({
      status: 400,
      message: 'table_name invalid.',
    });
  }
  next();
}
async function tableExists(req, res, next) {
  const { table_id } = req.params;
  const table = await service.read(table_id);
  if (table) {
    res.locals.table = table;
    return next();
  }
  return next({ status: 404, message: `table_id ${table_id} not found.` });
}

async function reservationExists(req, res, next) {
  const { reservation_id } = req.body.data;
  const reservation = await read(reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  return next({
    status: 404,
    message: `reservation_id ${reservation_id} not found.`,
  });
}

function reservationNotSeated(req, res, next) {
  const { status } = res.locals.reservation;
  if (status === 'seated') {
    return next({
      status: 400,
      message: 'Reservation is already seated.',
    });
  }
  next();
}

function validCapacity(req, res, next) {
  const { people } = res.locals.reservation;
  const { capacity } = res.locals.table;
  if (capacity < people) {
    return next({
      status: 400,
      message: 'Number in party exceeds table capacity.',
    });
  }
  next();
}



function tableNotOccupied(req, res, next) {
  const { reservation_id } = res.locals.table;
  if (reservation_id) {
    return next({
      status: 400,
      message: 'Table is occupied.',
    });
  }
  next();
}
function tableOccupied(req, res, next) {
  const { reservation_id } = res.locals.table;
  if (!reservation_id) {
    return next({
      status: 400,
      message: 'Table is not occupied.',
    });
  }
  next();
}

function capacityANumber(req, res, next){
       const {capacity} = req.body.data;
       if(Number.isInteger(capacity)){
           return next()
       } else {
           return next({
               status: 400, 
               message: `capacity field not formatted correctly. ${capacity} must be a number`
           })
       }
   }

async function create(req, res) {
  const newTable = await service.create(req.body.data);
  res.status(201).json({
    data: newTable[0],
  });
}

async function list(req, res) {
  const data = await service.list();
  res.json({ data });
}

async function update(req, res) {
  const { table_id } = req.params;
  const { reservation_id } = req.body.data;
  const updatedTable = {
    reservation_id: reservation_id,
    table_id: table_id,
  };
  const data = await service.update(updatedTable);
  res.json({ data });
}

async function finish(req, res) {
  const { table_id } = req.params;
  const { reservation_id } = res.locals.table;
  const reservation = await service.finish(table_id, reservation_id);

  res.json({ data: reservation });
}
module.exports = {
  create: [
    hasOnlyValidProperties,
    hasRequiredProperties,
    hasValidTableName,
    capacityANumber,
    asyncErrorBoundary(create),
  ],
  list: asyncErrorBoundary(list),
  update: [
    hasOnlyValidProperties,
    hasRequiredUpdateProperties,
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(reservationExists),
    reservationNotSeated,
    validCapacity,
    tableNotOccupied,
    asyncErrorBoundary(update),
  ],
  finish: [
    asyncErrorBoundary(tableExists),
    tableOccupied,
    asyncErrorBoundary(finish),
  ],
};

// const service = require("./tables.service")
// const asyncErrorBoundary = require("../errors/asyncErrorBoundary")
// const hasProperties = require("../errors/hasProperties")
// const reservationService = require("../reservations/reservations.service")
// const hasOnlyValidProperties = require("../errors/hasOnlyValidProperties")

// const VALID_PROPERTIES = [
//     "table_name",
//     "capacity"
// ]

// const VALID_PROPERTIES_FOR_PUT = [
//     "reservation_id"
// ]

// const hasRequiredProperties = hasProperties(
//     "table_name",
//     "capacity"
// )

// async function tableExists(req, res, next){
//     const {table_id} = req.params;
//     const data = await service.read(table_id);
//     if(data){
//         res.locals.table = data;
//         return next()
//     } else {
//         return next({
//             status: 404, 
//             message: `table_id: ${table_id} does not exist`
//         })
//     }
// }

// async function reservationExists(req, res, next){
//     const {reservation_id} = req.body.data;
//     const data = await reservationService.read(reservation_id)
//     if(data && data.status !=="Seated"){
//         res.locals.reservation = data;
//         return next()
//     }
//     else if(data && data.status==="Seated"){
//         return next({
//             status: 400, 
//             message: `reservation_id: ${reservation_id} has already been seated`
//         })
//     } else {
//         return next({
//             status: 404, 
//             message: `reservation_id: ${reservation_id} does not exist.`
//         })
//     }
// }

// function sufficientCapacity(req, res, next){
//     const {capacity} = res.locals.table;
//     const {people} = res.locals.reservation;
//     if(capacity >= people){
//         return next();
//     }
//     else{
//         return next({
//             status: 400,
//             message: `Table does not have suffience capacity to seat full party`
//         })
//     }
// }

// function nameMoreThanOneCharacter(req,res, next){
//     const {table_name} = req.body.data
//     if(table_name.length <= 1){
//         return next({
//             status: 400, 
//             message: `table_name must be at least 2 characters long`
//         })
//     }
//     next();
// }

// function capacityANumber(req, res, next){
//     const {capacity} = req.body.data;
//     if(Number.isInteger(capacity) && capacity >= 1){
//         return next()
//     } else {
//         return next({
//             status: 400, 
//             message: `capacity field not formatted correctly. ${capacity} must be a number`
//         })
//     }
// }


// function tableIsFree(req, res, next){
//     const {status} = res.locals.table
//     if(status==="Free"){
//         return next()
//     } else {
//         return ({
//             status: 400, 
//             message: "Table is occupied"
//         })
//     }
// }
// //
// function tableIsOccupied(req, res, next){
//     const {status} = res.locals.table
//     if(status==="Occupied"){
//         return next();
//     } else {
//         return ({
//             status: 400, 
//             message: "Table is not occupied"
//         })
//     }
// }
// //

// async function list(req, res) {
//     res.json({data: await service.list()})
//   }

// // async function update(req, res){
// //     const {table} = res.locals
// //     const {reservationId} = res.locals.reservation;
// //     const {table_id} = req.params;
// //     const data = {
// //         ...table,
// //         table_id: table_id, 
// //         reservation_id: reservationId,
// //         status: "Occupied"
// //     }
// //     const updatedTable= await service.update(data)
// //     const updatedReservation = {
// //         status: "seated", 
// //         reservation_id: reservationId
// //     }
// //     await reservationService.update(updatedReservation)
// //     res.status(200).json({data: updatedTable})
// // }

// async function update(req, res){
//     const {reservation_id} = res.locals.reservation;
//     console.log(reservation_id)
//     const updatedTable = {...res.locals.table, reservation_id}
//     const data = await service.seat(updatedTable.table_id, reservation_id)
//     res.status(200).json({data})
// }

// async function finish(req, res){
//     const {table} = res.locals
//     const {table_id} = req.params
//     const updatedData = {
//         ...table,
//         status: "Free"
//     }
//     await service.finish(updatedData)
//     res.json({data: updatedTable})
// }

// async function create(req, res){
//     const data = await service.create(req.body.data)
//     res.status(201).json({data})
// }

//   module.exports = {
//     list: asyncErrorBoundary(list),
//     seat: [
//         hasProperties(...VALID_PROPERTIES_FOR_PUT),
//         hasOnlyValidProperties(...VALID_PROPERTIES_FOR_PUT),
//         asyncErrorBoundary(tableExists),
//         asyncErrorBoundary(reservationExists),
//         tableIsFree,
//         sufficientCapacity,
//         asyncErrorBoundary(update)
//         ],
//     finish: 
//         [
//         asyncErrorBoundary(tableExists),
//         tableIsOccupied,
//         asyncErrorBoundary(finish)],
//     create: [
//           hasOnlyValidProperties(...VALID_PROPERTIES),
//           hasRequiredProperties,
//           nameMoreThanOneCharacter,
//           capacityANumber,
//           asyncErrorBoundary(create)
//         ]
//   }