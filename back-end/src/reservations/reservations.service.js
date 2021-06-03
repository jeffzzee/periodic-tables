const db = require("../db/connection");//require knex connection

//create
function create(newReservation) {
    return db("reservations")
    .insert(newReservation, "*")//create in table with insert
    .then((newlyAddedReservation) => newlyAddedReservation[0]);//send back first instance
}

//read
function read(reservation_id) {
    return db("reservations")
    .where({ reservation_id })//match id
    .first();//send back first instance
}

//list
function list(reservation_date) {
  return db("reservations")
    .select("*")//select all
    .where({ reservation_date })//find by date in table
    .orderBy("reservation_time", "asc");//order by time ascending
}

module.exports = {//exports by function name
  create,
  list,
  read,
};