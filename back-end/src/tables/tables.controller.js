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

const hasRequiredProperties = hasProperties("table_name", "capacity");

const hasRequiredUpdateProperties = hasProperties("reservation_id");

function hasValidName(req, res, next) {
  const { table_name } = req.body.data;
  if (table_name.length < 2) {
    return next({
      status: 400,
      message: "table_name is invalid.",
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
  return next({ 
    status: 404, 
    message: `table_id ${table_id} not found.` });
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
  if (status === "seated") {
    return next({
      status: 400,
      message: "This reservation is already seated.",
    });
  }
  next();
}

function hasValidCapacity(req, res, next) {
  const { people } = res.locals.reservation;
  const { capacity } = res.locals.table;
  if (capacity < people) {
    return next({
      status: 400,
      message: "Table capacity is not sufficient to seat the party.",
    });
  }
  next();
}



function tableIsFree(req, res, next) {
  const { reservation_id } = res.locals.table;
  if (reservation_id) {
    return next({
      status: 400,
      message: "Table is occupied.",
    });
  }
  next();
}
function tableIsOccupied(req, res, next) {
  const { reservation_id } = res.locals.table;
  if (!reservation_id) {
    return next({
      status: 400,
      message: "This table is not occupied.",
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
               message: `capacity field is not formatted correctly. ${capacity} must be a number`
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
    hasValidName,
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
    hasValidCapacity,
    tableIsFree,
    asyncErrorBoundary(update),
  ],
  finish: [
    asyncErrorBoundary(tableExists),
    tableIsOccupied,
    asyncErrorBoundary(finish),
  ],
};

