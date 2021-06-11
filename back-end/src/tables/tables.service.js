const db = require("../db/connection");//require knex connection

//create
function create(newTable) {
    return db("tables")
    .insert(newTable, "*")//create in table with insert
    .then((newlyAddedTable) => newlyAddedTable[0]);//send back first instance Perhaps NOT 1st but all tables...
}

//read
function read(table_id) {
    return db("tables")
    .where({ table_id })//match id
    .first();//send back first instance
}

//list
function list() {
  return db("tables")
    .select("*")//select all
    .orderBy("table_name", "asc");//order by name ascending
}
function update(newTable){
  return db("tables")
  .where({table_id:newTable.table_id})
  .update(newTable,"*")
  .returning("*")
  .then((updated)=>updated[0])

}
// function proofOfResRemoval
function destroyResId(table_id){
  return db("tables")
  .where({table_id:table_id})
  .update("reservation_id",null)
  .then((updated)=>updated[0])
}




module.exports = {
  create,
  read,
  list,
  update,
  destroyResId,
};