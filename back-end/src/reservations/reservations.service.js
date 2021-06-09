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
function list(input) {
  const keys =Object.entries(input)

  return db("reservations")
    .select("*")//select all
    .where({ input })//find by date in table
    .whereNot("status","finished")//check that status is not finished
    .orderBy("reservation_time", "asc");//order by time ascending
}

//working before manipulation to incorporate mobile_phone
//if the above doesn't work, just create a new list function... you're sending a second api type anyway 
// function list(reservation_date) {
  
//   return db("reservations")
//     .select("*")//select all
//     .where({ reservation_date })//find by date in table
//     .whereNot("status","finished")//check that status is not finished
//     .orderBy("reservation_time", "asc");//order by time ascending
// }

function update(reservationId,newInfo){
  return db("reservations")
  .where({reservation_id:reservationId})
  .update("status",newInfo)
}

function updateStatus(reservationId,newStatus){
  return db("reservations")
  .where({reservation_id:reservationId})
  .update("status",newStatus)
  .then((updated)=>update[0])
}
function updateResStatus(reservationId,newStatus){
  return db("reservations")
  .where({reservation_id:reservationId})
  .update("status",newStatus)
  .returning("*")
  .then ((x)=>x[0])
}

module.exports = {//exports by function name
  create,
  list,
  read,
  update,
  updateStatus,
  updateResStatus
};