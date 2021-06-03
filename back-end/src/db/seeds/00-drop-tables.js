module.exports.seed=function(knex){
    return knex("reservations").del()
}