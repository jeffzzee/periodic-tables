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
function list(reservation_date,mobile_number) {
  if(reservation_date){
    return db("reservations")
      .select("*")//select all
      .where({ reservation_date })//find by date in table
      .whereNot("status","finished")//check that status is not finished
      .orderBy("reservation_time", "asc");//order by time ascending
  }
  if(mobile_number){
    return db("reservations")
      .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
      )//use Provided Mobile number validator
      .whereNot("status","finished")//check that status is not finished
      .orderBy("reservation_date");//order by time ascending
  }
}

//update
function update(reservationId,newInfo){
  return db("reservations")
  .where({reservation_id:reservationId})
  .update("status",newInfo)
}

//update Status
function updateStatus(reservationId,newStatus){
  return db("reservations")
    .where({reservation_id:reservationId})
    .update("status",newStatus)
    .then((updated)=>update[0])
}

//update reservation status
function updateResStatus(reservationId,newStatus){
  return db("reservations")
    .where({reservation_id:reservationId})
    .update("status",newStatus)
    .returning("*")
    .then ((x)=>x[0])
}

//update reservation
function updateRes(reservationId,newInfo){
  return db("reservations")
    .where({reservation_id:reservationId})
    .update(newInfo)
    .returning("*")
    .then ((x)=>x[0])
}

module.exports = {//exports by function name
  create,
  list,
  read,
  update,
  updateStatus,
  updateResStatus,
  updateRes
};