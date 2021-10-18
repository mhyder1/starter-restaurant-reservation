const service = require('./reservations.service');
const hasProperties = require('../errors/hasProperties');
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');

/**
 * List handler for reservation resources
 */

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
  'first_name',
  'last_name',
  'mobile_number',
  'reservation_date',
  'reservation_time',
  'people',
  'status',
  'reservation_id',
  'created_at',
  'updated_at',
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
  //
  res.locals.reservation = req.body.data;
  //
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
  'first_name',
  'last_name',
  'mobile_number',
  'reservation_date',
  'reservation_time',
  'people'
);

const hasRequiredUpdateProperties = hasProperties('status');

function hasPeople(req, res, next) {
  const { people } = req.body.data;
  const validNumber = Number.isInteger(people);
  if (!validNumber || people <= 0) {
    return next({
      status: 400,
      message: 'Number of people entered is an invalid number.',
    });
  }
  next();
}
function hasStatusBooked(req, res, next) {
  const { status } = res.locals.reservation;
  if (status === 'seated' || status === 'finished') {
    return next({
      status: 400,
      message: `Reservation status ${status} invalid.`,
    });
  }
  next();
}

const convertTime12to24 = (time12h) => {
  const [time, modifier] = time12h.split(' ');

  let [hours, minutes] = time.split(':');

  if (hours === '12') {
    hours = '00';
  }

  if (modifier === 'PM') {
    hours = parseInt(hours, 10) + 12;
  }

  return `${hours}:${minutes}`;
};

function hasValidDateTime(req, res, next) {
  const { reservation_date, reservation_time } = req.body.data;
  let today = new Date();
  let resDateTime = reservation_date + ' ' + reservation_time;
  let resAsDate = new Date(resDateTime);

  const timeReg = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

  if (reservation_time.match(timeReg) === null) {
    return next({
      status: 400,
      message: `reservation_time is not a valid time.`,
    });
  }
  if (reservation_time < '10:30' || reservation_time > '21:30') {
    return next({
      status: 400,
      message: 'Reservation must be between 10:30AM and 9:30PM.',
    });
  }
  if (isNaN(resAsDate.getDate())) {
    return next({
      status: 400,
      message: 'reservation_date is not a valid date.',
    });
  }
  if (resAsDate < today) {
    return next({
      status: 400,
      message: 'Reservation must be booked for future date.',
    });
  }

  if (resAsDate && resAsDate.getDay() === 2) {
    return next({
      status: 400,
      message: 'Restaurant closed on Tuesdays.',
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
function hasValidStatus(req, res, next) {
  //check the status in the request
  const { status } = req.body.data;
  const validStatus = ['booked', 'seated', 'finished', 'cancelled'];
  if (!validStatus.includes(status)) {
    return next({
      status: 400,
      message: `Status ${status} is not valid.`,
    });
  }
  next();
}

function hasNotFinishedStatus(req, res, next) {
  //check the status in the reservation being updated
  const { status } = res.locals.reservation;
  if (status === 'finished') {
    return next({
      status: 400,
      message: `Status ${status} cannot be updated.`,
    });
  }
  next();
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasOnlyValidProperties,
    hasRequiredProperties,
    hasPeople,
    hasValidDateTime,
    hasStatusBooked,
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(reservationExists), read],
  update: [
    hasRequiredProperties,
    hasOnlyValidProperties,
    asyncErrorBoundary(reservationExists),
    hasPeople,
    hasValidDateTime,
    hasStatusBooked,
    asyncErrorBoundary(update),
  ],
  updateStatus: [
    hasRequiredUpdateProperties,
    asyncErrorBoundary(reservationExists),
    hasNotFinishedStatus,
    hasValidStatus,
    asyncErrorBoundary(updateStatus),
  ],
};
// //const { create } = require("./reservations.service");
// const service = require ("./reservations.service");
// const asyncErrorBoundary = require("../errors/asyncErrorBoundary")
// const hasProperties = require("../errors/hasProperties")
// const hasOnlyValidProperties = require("../errors/hasOnlyValidProperties")

// const REQUIRED_PROPERTIES = [
//   "first_name", 
//   "last_name", 
//   "mobile_number",
//   "reservation_date",
//   "reservation_time",
//   "people",
// ];

// const VALID_PROPERTIES = [
//   ...REQUIRED_PROPERTIES,
//   "status",
//   "reservation_id",
//   "created_at", 
//   "updated_at",
// ]

// const VALID_STATUS_OPTIONS= [
//   "booked", 
//   "seated", 
//   "finished",
//   "cancelled",
// ]

// async function reservationExists(req, res, next){
//   const {reservationId} = req.params;
//   const data = await service.read(reservationId)
//   if(data){
//     res.locals.reservation = data
//     return next();
//     } else {
//       return next({
//         status: 404, 
//         message: `reservation_id: ${reservationId} does not exist`
//       })
//     }
// }

// const hasRequiredProperties = hasProperties(REQUIRED_PROPERTIES)

// function queryIsValid(req, res, next){
//   const {data, mobile_number} = req.query;
//   if(!date && !mobile_number){
//     return next({
//       status: 400, 
//       message: `Missing required query data: either a date or mobile_number query required.`
//     })
//   }
//   next()
// }

// function isValidTime(req, res, next){
//   const {reservation_time} = req.body.data;

//   const timeRegularEx = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
  
//   if(reservation_time.match(timeRegularEx)===null){
//     return next({
//       status: 400,
//       message: "reservation_time is not a valid time.",
//     });
//   }
//   next();
// }
  
//   function isValidDate(req,res, next){
//   const {reservation_date, reservation_time} = req.body.data;
//   let reservationDateTime = reservation_date + " " + reservation_time;
//   let reservationAsDate = new Date(reservationDateTime);
//   if(isNaN(reservationAsDate.getDate())){
//     return next({
//       status: 400, 
//       message: "reservation_date is not a valid date."
//     })
//   }
//   next();
//   }

//   function peopleIsNumber(req, res, next){
//     const {people} = req.body.data;
//     if(!Number.isInteger(people) || people < 1){
//       return next({
//         status: 400, 
//         message: "Number of people must be a number of one or more"
//       })
//     }
//     next()
//   }
//   //   const peopleInt = parseInt(people)
//   //   const sizeOfParty = Number.isInteger(peopleInt)
//   //   if(!sizeOfParty){
//   //         return next({
//   //           status: 400,
//   //           message: `${people} is not a valid entry. people must be a number`,
//   //         })
//   //   }
//   //   next()
//   // }
 
// function dayNotTuesday(req, res, next){
//   const {reservation_date} = req.body.data;
//   const date = new Date(reservation_date);
//   const theDay= date.getUTCDay();

//   if(theDay===2){
//     return next({
//       status: 400, 
//       message: "The restaurant is closed on Tuesdays.",
//     })
//   } else {
//     return next();
//   }
// }

// function dayNotInThePast(req, res, next){
//   const {reservation_date, reservation_time} = req.body.data;
//   const now = Date.now();
//   const reservationDate = new Date(`${reservation_date} ${reservation_time}`);
//   if(reservationDate < now){//first date is in future, or it is today
//       return next({
//         status: 400, 
//         message: "Reservation must be made for a future day and time"
//       })
//     }
//     next()
//   }

// function duringBusinessHours(req, res, next){
//   const {reservation_date, reservation_time} = req.body.data;
//   const reservationDate = new Date(`${reservation_date}T${reservation_time}:00`);
//   if(reservationDate.getHours() < 10 || 
//     (reservationDate.getHours() === 10 && reservationDate.getMinutes() <30)){
//       return next({
//       status: 400, 
//       message: "The restaurant opens at 10:30am"
//       })
//     } else if(reservationDate.getHours() >=23 || 
//     (reservationDate.getHours()===22 && reservationDate.getMinutes() >=30)){
//     return next({
//       status: 400, 
//       message: "The restaurant is closed after 10:30pm"
//     })
//   } else if((reservationDate.getHours()===21 && reservationDate.getMinutes()>=30) ||
//   (reservationDate.getHours()===22 && reservationDate.getMinutes()<30)){
//     return next({
//       status: 400, 
//       message: "Reservation must be made at least an hour before closing time."
//     })
//   }
//     next()
// }

// async function searchByDateOrMobile(req, res, next){
//   const {date, mobile_number} = req.query;
//   if(date){
//     const reservations = await service.list(date);
//     if(reservations.length){
//       res.locals.data = reservations;
//       return next();
//     }else {
//       return next({
//         status: 404,
//         message: `No pending reservations found for ${date}`
//       })
//     }
//   }
//   if(mobile_number){
//     const reservation = await service.search(mobile_number)
//     res.locals.data = reservation;
//     return next();
//     }
//   }

//   function isValidStatus(req, res, next){
//     const {status} = req.body.data;
//     if(!VALID_STATUS_OPTIONS.includes(status)){
//       return next({
//         status: 400, 
//         message: `${status} is not a valid status`
//       })
//     }
//     res.locals.status = status;
//     next();
//   }

//   function statusIsNotFinished(req, res, next){
//     const {status}= res.locals.reservation;
//     if(status==="finished"){
//       return next({
//         status: 400, 
//         message: "This reservation has been finished and cannot be updated."
//       })
//     }
//     next();
//   }
// /**
//  * List handler for reservation resources
//  */
// async function list(req, res) {
//   const {data} = res.locals;
//   res.json({data})
// }

// async function read(req, res){
//   const {reservation} = res.locals;
//   res.json({data: reservation})
// }

// async function createNew(req, res){
//   const newReservation = await service.create(req.body.data)
//   res.status(201).json({data: newReservation});
// }

// async function updateStatus(req, res){
//   const {reservation, status} = res.locals;
//   const updatedData = {
//     ...reservation, 
//     status: status,
//   }
//   const updatedReservation = await service.update(updatedData)
//   res.status(200).json({data: updatedReservation})
// }

// async function updateReservation(req, res){
//   const data = await service.update({...res.locals.reservation});
//   res.status(200).json({data})
  
// }

// module.exports = {
//   create: [
//     hasProperties(...REQUIRED_PROPERTIES), 
//     hasOnlyValidProperties(...VALID_PROPERTIES), 
//     isValidTime, 
//     isValidDate, 
//     dayNotTuesday, 
//     dayNotInThePast,
//     duringBusinessHours,
//     peopleIsNumber, 
//     asyncErrorBoundary(createNew),],
//   list: [
//     asyncErrorBoundary(searchByDateOrMobile),
//     list,
//   ],
//   read: [
//     asyncErrorBoundary(reservationExists), 
//     asyncErrorBoundary(read)], 
//   updateStatus: [
//     hasProperties("status"),
//     hasOnlyValidProperties("status"),
//     asyncErrorBoundary(reservationExists),
//     isValidStatus,
//     statusIsNotFinished,
//     asyncErrorBoundary(updateStatus),
//   ],
//   updateReservation: [
//     hasProperties(...REQUIRED_PROPERTIES),
//     hasOnlyValidProperties(...VALID_PROPERTIES),
//     asyncErrorBoundary(reservationExists),
//     isValidTime, 
//     isValidDate, 
//     dayNotTuesday, 
//     dayNotInThePast,
//     duringBusinessHours,
//     peopleIsNumber, 
//     asyncErrorBoundary(updateReservation),
//   ]
// };