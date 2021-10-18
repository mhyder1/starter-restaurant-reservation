const router = require('express').Router({ mergeParams: true });
const controller = require('./tables.controller');
const methodNotAllowed = require('../errors/methodNotAllowed');

router
  .route('/:table_id/seat')
  .put(controller.update)
  .delete(controller.finish)
  .all(methodNotAllowed);
router
  .route('/')
  .post(controller.create)
  .get(controller.list)
  .all(methodNotAllowed);

module.exports = router;

// const router = require("express").Router();
// const controller = require("./tables.controller")
// const methodNotAllowed = require("../errors/methodNotAllowed")

// router
//     .route("/:table_id/seat")
//     .put(controller.seat)
//     .delete(controller.finish)
//     .all(methodNotAllowed);

// router
//     .route("/")
//     .get(controller.list)
//     .post(controller.create)
//     .all(methodNotAllowed);



//     module.exports = router;