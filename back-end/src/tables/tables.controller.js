/**
 * List handler for reservation resources
 */

const service = require("./tables.service");
const serviceForReservation = require("../reservations/reservations.service")
const asyncErrorBoundary= require("../errors/asyncErrorBoundary");
const { table } = require("../db/connection");

//all required table form items
const fullForm=[
  "table_name","capacity"
]

//check any existing form item has a value
function emptyCheck(input){
  for (let key in input){
    if (!input[key]){
      return false
    }
  }
  return true
}

//check form validity
function validFormSubmission(request,response,next){
  const {data={}}=request.body //pulls data or uses empty object
  //check submission fields' existence via full form 
  const dataKeys = Object.keys(data)//array of all keys
  fullForm.forEach((item)=>{
    if(!dataKeys.includes(item)){//if the request is missing a fullform element
      return next({
        status: 400,
        message: `The ${item} is missing`
      })
    }
  })
  //use emptyCheck helper function
  if (!emptyCheck(data)) {
    return next({
      status: 400,
      message: "Invalid data format provided. Requires {string:table_name, number: capacity}"
    }) //if false go to error handler
  }
  //if capacity is not a number
  if (typeof data.capacity !== "number") {
    return next({
      status: 400,
      message: "Needs to be a number, capacity is not a number.",
    });
  }
  //if capacity is less than 1
  if (data.capacity < 1){
    return next({
      status: 400,
      message: "capacity needs to be a number greater than 0",
    });
  }
  //if table name is too short
  if(data.table_name.length<2){
    return next({
      status:400,
      message:"table_name must be at least 2 characters long"
    })
  }
  next()
}

//create table in table table
async function create(request,response){
  const{reservation_id=null, table_name, capacity}=request.body.data
  const newTableObject={
    table_name:table_name,
    capacity:capacity,
    reservation_id:reservation_id
  } 
  const newTableSuccess = await service.create(newTableObject);
  response
    .status(201)
    .json({data: newTableSuccess})
}

//list all tables
async function list(request, response) {
  const tables = await service.list()
  response.json(
    {data:
      tables
    });
}

//validate table form
async function validSeating(request,response,next){
  //data missing
  if(!request.body.data||!request.body.data.reservation_id){
    return next({
      status:400,
      message:"request invalid, data requires a reservation_id"
    })
  }
  //use reservation service READ to find the reservation going into table assignment
  const theUpdatedReservation=await serviceForReservation.read(Number(request.body.data.reservation_id))
  if(!theUpdatedReservation){
    return next({
      status:404,
      message:`reservation ${request.body.data.reservation_id} does not exist.`
    })
  }
  //check capacity is enough for reservation size
  if(response.locals.table.capacity<theUpdatedReservation.people){
    return next({
      status:400,
      message:"reservation group size is too big for table and does not have sufficient capacity."
    })
  }
  //check if table has already been occupied
  if(response.locals.table.reservation_id){
    return next({
      status:400,
      message:"table is already occupied"
    })
  }
  next()
}

//check that table exists
async function tableExists(request,response,next){
  const table= await service.read(request.params.table_id)
  if(table){
    response.locals.table=table
    return next()
  }
  next({
    status:404, 
    message:`Table ${request.params.table_id} does not exist`
  })
}

//update the table
async function update(request,response){
  const updatedTableDetails ={
    ...response.locals.table,
    reservation_id:Number(request.body.data.reservation_id),
  }
  await serviceForReservation.updateStatus(updatedTableDetails.reservation_id,"seated")
  const tableUpdateData=await service.update(updatedTableDetails)
  response
    .status(200)
    .json({
      data:tableUpdateData
    })
}

//change reservation status via reservation service
async function occupiedStatus(request,response,next){
  if(request.body.data.reservation_id){
    const reservation= await serviceForReservation.read(request.body.data.reservation_id)
    if(reservation.status==="seated"){
      return next({
        status:400,
        message:"Reservation is already seated"
      })
    }
  }
  next()
}

//check if table is occupied
function tableOccupied(request,response,next){
  if(response.locals.table.reservation_id===null){
    return next({
      status:400,
      message:"table is not occupied"
    })
  }
  next()
}

//remove finished occupation by removing assigned reservation
async function destroyResId(request,response,next){
  const reservation_id=response.locals.table.reservation_id
  await serviceForReservation.updateStatus(reservation_id,"finished")
  const data = await service.destroyResId(Number(response.locals.table.table_id))
  response
    .status(200)
    .json({data})
}


module.exports = {
  list:asyncErrorBoundary(list),
  create:[
    validFormSubmission,
    asyncErrorBoundary(create)
  ],
  update:[
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(validSeating),
    asyncErrorBoundary(occupiedStatus),
    asyncErrorBoundary(update)
  ],
  destroyResId:[
    asyncErrorBoundary(tableExists),
    tableOccupied,
    asyncErrorBoundary( destroyResId)
  ]
}
