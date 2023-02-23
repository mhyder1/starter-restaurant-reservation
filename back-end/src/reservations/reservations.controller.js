const service = require('./reservations.service');
const hasProperties = require('../errors/hasProperties');
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');


async function list(req, res) {
  const { date, mobile_number } = req.query;

    if (date) {
      res.json({ data: await service.listByDate(date) });
    } else if (mobile_number) {
      res.json({ data: await service.search(mobile_number) });
    } else {
      res.json({ data: await service.list() });
    }
}

const VALID_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
  "status",
  "reservation_id",
  "created_at",
  "updated_at",
];

async function reservationExists(req, res, next) {
  const { reservation_id } = req.params;
  const reservation = await service.read(reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `Reservation ${reservation_id} cannot be found.`,
  });
}

function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;
  res.locals.reservation = req.body.data;
  
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

const hasRequiredProperties = hasProperties(
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
);

const hasRequiredUpdateProperties = hasProperties("status");

function statusIsBooked(req, res, next) {
  const { status } = res.locals.reservation;
  if (status === "seated" || status === "finished") {
    return next({
      status: 400,
      message: `Reservation status: ${status} is invalid.`,
    });
  }
  next();
}

function peopleIsNumber(req, res, next) {
  const { people } = req.body.data;
  const validNumber = Number.isInteger(people);
  if (!validNumber || people <= 0) {
    return next({
      status: 400,
      message: "The number of people entered is invalid. Number of people must be at least 1",
    });
  }
  next();
}

function hasValidDateTime(req, res, next) {
  const { reservation_date, reservation_time } = req.body.data;
  let today = new Date();
  let resDateTime = reservation_date + ' ' + reservation_time;
  let reservationAsDate = new Date(resDateTime);

  const timeReg = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

  if (reservation_time.match(timeReg) === null) {
    return next({
      status: 400,
      message: `reservation_time ${reservation_time} is not a valid time.`,
    });
  }

  if (reservation_time < "10:30" || reservation_time > "21:30") {
    return next({
      status: 400,
      message: "Reservations must be between the hours of 10:30AM and 9:30PM.",
    });
  }

  if (isNaN(reservationAsDate.getDate())) {
    return next({
      status: 400,
      message: "reservation_date is not a valid date.",
    });
  }
  if (reservationAsDate < today) {
    return next({
      status: 400,
      message: "Reservation date must be a future date.",
    });
  }

  if (reservationAsDate && reservationAsDate.getDay() === 2) {
    return next({
      status: 400,
      message: "The restaurant is closed on Tuesdays.",
    });
  }
  next();
}

function hasValidStatus(req, res, next) {
  const { status } = req.body.data;
  const validStatus = ["booked", "seated", "finished", "cancelled"];
  if (!validStatus.includes(status)) {
    return next({
      status: 400,
      message: `Status ${status} is not valid.`,
    });
  }
  next();
}

function statusNotFinished(req, res, next) {
  const { status } = res.locals.reservation;
  if (status === "finished") {
    return next({
      status: 400,
      message: `Status ${status} cannot be updated.`,
    });
  }
  next();
}

async function create(req, res) {
  const newReservation = await service.create(req.body.data);
  res.status(201).json({
    data: newReservation[0],
  });
}

function read(req, res, next) {
  const { reservation } = res.locals;
  res.json({ data: reservation });
}

async function update(req, res, next) {
  const { reservation_id } = res.locals.reservation;
  const updatedReservation = {
    ...req.body.data,
    reservation_id,
  };
  const updatedRes = await service.update(updatedReservation);
  res.json({ data: updatedRes[0] });
}

async function updateStatus(req, res, next) {
  const { reservation_id } = req.params;
  const updatedReservation = {
    ...req.body.data,
    reservation_id,
  };
  const updatedRes = await service.updateStatus(updatedReservation);
  res.json({ data: updatedRes[0] });
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(reservationExists), read],
  create: [
    hasOnlyValidProperties,
    hasRequiredProperties,
    peopleIsNumber,
    hasValidDateTime,
    statusIsBooked,
    asyncErrorBoundary(create),
  ],
  update: [
    hasRequiredProperties,
    asyncErrorBoundary(reservationExists),
    peopleIsNumber,
    hasValidDateTime,
    asyncErrorBoundary(update),
  ],
  updateStatus: [
    hasRequiredUpdateProperties,
    asyncErrorBoundary(reservationExists),
    statusNotFinished,
    hasValidStatus,
    asyncErrorBoundary(updateStatus),
  ],
};
