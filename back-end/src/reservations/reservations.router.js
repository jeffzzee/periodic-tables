/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const methodNotAllowed = require("../errors/methodNotAllowed");
const controller = require("./reservations.controller");

router.route("/:reservation_id/status")
.put(controller.updateStatus)
.all(methodNotAllowed);

router.route("/:reservation_id")
    .get(controller.read)
    // .delete(controller.destroy)//this cancel is not a true delete
    .put(controller.update)
    .all(methodNotAllowed);

// router.route"/:query" //likely as a param, the phone number can be searched just like date was...
    

router.route("/")
    .get(controller.list)
    .post(controller.create)
    .all(methodNotAllowed)

    
module.exports = router;
