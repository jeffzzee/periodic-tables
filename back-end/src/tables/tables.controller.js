/**
 * List handler for reservation resources
 */

const service = require("./tables.service");
const serviceForReservation = require("../reservations/reservations.service")
const asyncErrorBoundary= require("../errors/asyncErrorBoundary");
const { table } = require("../db/connection");
// const reservations = require("../reservations/reservations.controller");




// async function resExistsMidWare(request,response,next){
//   let foundReservation = ""
//   const reservationId = request.params.reservation_id
//   if (reservationId){
//     foundReservation = await service.read(reservationId)
//   }if(foundReservation){
//     response.locals.reservationData = foundReservation
//     next()
//   }
//   else{
//   next({
//     status: 404,
//     message: `${reservationId} not found`
//   })
//   }
// }

// function asDateString(date) {
//   return `${date.getFullYear().toString(10)}-${(date.getMonth() + 1)
//     .toString(10)
//     .padStart(2, "0")}-${date.getDate().toString(10).padStart(2, "0")}`;
// }
// function today() {
//   return asDateString(new Date());
// }

const fullForm=[
  "table_name","capacity"
]//all required form items

function emptyCheck(input){
  for (let key in input){
    if (!input[key]){
      return false
    }
  }
  return true
}

function validFormSubmission(request,response,next){
  const {data={}}=request.body //pulls data or uses empty object
  // const reservationDate = new Date(data.reservation_date
  // ${data.reservation_test} GMT-0500
  // )
  //check submission existence
  const dataKeys = Object.keys(data)//array of all keys
  fullForm.forEach((item)=>{
    if(!dataKeys.includes(item)){//if the request is missing a fullform element
      return next({
        status: 400,
        message: `The ${item} is missing`
      })
    }
  })
  if (!emptyCheck(data)) //|| data.last_name === '' || data.mobile_number === '' )
  {//send request data to null checker
    return next({
      status: 400,
      message: "Invalid data format provided. Requires {string:table_name, number: capacity}"
    }) //if false go to error handler
  }
  if (typeof data.capacity !== "number") {
    return next({
      status: 400,
      message: "Needs to be a number, capacity is not a number.",
    });
  }
  if (data.capacity < 1){
    return next({
      status: 400,
      message: "capacity needs to be a number greater than 0",
    });
  }
  if(data.table_name.length<2){
    return next({
      status:400,
      message:"table_name must be at least 2 characters long"
    })
  }
  next()
}
  
  // if(isReservationPast(data.reservation_date)){
  //   return next({
  //     status:400,
  //     message:"reservation date must be made for the future"
  //   })
  // }

  // if (!/\d{4}-\d{2}-\d{2}/.test(data.reservation_date)) {
  //   return next({
  //     status: 400,
  //     message: "reservation_date is not a date.",
  //   });
  // }
  // if (reservationDate.getDay() === 1) {
  //   console.log("tuesday tested")
  //   return next({
  //     status: 400,
  //     message:
  //     "reservation_date cannot be made on a Tuesday, the restaurant is closed.",
  //   });
  // }
  // start = new Date(${data.reservation_date} 10:30:00 GMT-500),
  // end = new Date(${data.reservation_date} 21:30:00 GMT-500);
  
  // if(reservationDate < new Date().getTime()){
  //   console.log("future tested")
  //   return next({
  //     status:400,
  //     message: "reservations must be made for the future"
  //   })
  // }
  // const now=today()
  // const reserveDateTime=new Date(`${data.reservation_date}T${data.reservation_time}:00.000`)//extends the date/time continuum for comparison of past
  // if (reserveDateTime<now){
  //   return next({status:400,message:"reservation_time must be in the future."})
  // }
  // if(reserveDateTime.getHours()===10&&reserveDateTime.getMinutes()<30){
  //   return next({status:400,message:"reservation_time must come after our opening time of 10:30am"})
  // }
  // if(reserveDateTime.getHours()===9&&reserveDateTime.getMinutes()>30){
  //   return next({status:400,message:"reservation_time must be made an hour before our closing time of 10:30pm"})
  // }
  
  // if (!/[0-9]{2}:[0-9]{2}/.test(data.reservation_time)) {
  //   return next({
  //     status: 400,
  //       message: "reservation_time is not a time.",
  //     });
  //   }
    // const todaysDate = new Date();
    
    
    // if (reserveDate < todaysDate) {
      //   return next({
        //     status: 400,
        //     message: "Reservations must be made for a future date.",
        //   });
        // }
        // if (
          //   reserveDate.getTime() < start.getTime() ||
          //   reserveDate.getTime() > end.getTimezoneOffset()
          // ) {
            //   return next({
              //     status: 400,
              //     message: "Reservations cannot be made before 10:30am or after 9:30pm.",
              //   });
              // }
            //   if (data.reservation_time<"10:30"||data.reservation_time>"21:30"){
            //     return next ({
            //       status:400,
            //       message:"reservation cannot be made before 10:30am or after 9:30pm."
            //     })
            //   }
            //   next();
            // }
            
            
            
            
            /*function dateChecker(date){
  if (date)
}
function timeChecker(time){
  
}*/
// function isReservationPast(date) {
//   const temp = date.split("-");
//   const newDate = new Date(
//     Number(temp[0]),
//     Number(temp[1]) - 1,
//     Number(temp[2]) + 1
//   );
//   // indexing for the months etc.
//   return newDate.getTime() < new Date().getTime();
// } 

async function create(request,response){
  const{reservation_id=null, table_name, capacity}=request.body.data
  const newTableObject={
    table_name:table_name,
    capacity:capacity,
    reservation_id:reservation_id
  } 
  console.log("requestbodydata",request.body.data)
  const newTableSuccess = await service.create(newTableObject);
  response
  .status(201)
  .json({data: newTableSuccess})
}

async function list(request, response) {

  const tables = await service.list()
  response.json({data:tables
  });
}

// async function getReservation(id){
//   return await serviceForReservation.read(id)
// }

// const validSeatingAssignmentRequest=["table_id","reservation_id"]

async function validSeating(request,response,next){
  //data missing
  if(!request.body.data||!request.body.data.reservation_id){
    return next({
      status:400,
      message:"request invalid, data requires a reservation_id"
    })
  }
  const theUpdatedReservation=await serviceForReservation.read(Number(request.body.data.reservation_id))
  // getReservation(Number(request.body.data.reservation_id))
  if(!theUpdatedReservation){
    // response.locals.theUpdatedReservation=theUpdatedReservation
    return next({status:404,message:`reservation ${request.body.data.reservation_id} does not exist.`})

  }
  if(response.locals.table.capacity<theUpdatedReservation.people){
    console.log("capacityChecker reached")
    console.log("locals capacity",response.locals.table.capacity)
    console.log("locals res id",response.locals.table.reservation_id)
    console.log("reservation people",theUpdatedReservation.people)
    return next({status:400,message:"reservation group size is too big for table and does not have sufficient capacity."})
  }
  
  if(response.locals.table.reservation_id){
    console.log("occupied reached...")
    console.log("reservation Id preexisting",response.locals.table.reservation_id)
    return next({status:400,message:"table is already occupied"})
  }
  
  //capacity of table vs reservation size
  //already seated
  // if(theUpdatedReservation.status==="seated"){
  //   next({status:400,message:"table is already seated."})
  // }
  //occupied?
  //end middleware
  next()
}

async function tableExists(request,response,next){
  const table= await service.read(request.params.table_id)
  console.log(table,"table")
  if(table){
    response.locals.table=table
    return next()
  }
  //NOT Passing where data is missing
  //
  next({status:404, message:`Table ${request.params.table_id} does not exist`})
}

async function update(request,response){
  // console.log("update reached")
  const updatedTableDetails ={
    ...response.locals.table,
    reservation_id:Number(request.body.data.reservation_id),
    // status:"occupied"
  }
  console.log(updatedTableDetails,"updated table deetails")
  // const resUpdateData = await serviceForReservation.update(response.locals.theUpdatedReservation, "seated")
  await serviceForReservation.updateStatus(updatedTableDetails.reservation_id,"seated")
  const tableUpdateData=await service.update(updatedTableDetails)
  console.log(tableUpdateData,"table update data from update")
  response
  .status(200)
  .json({data:tableUpdateData})
}
async function occupiedStatus(request,response,next){
  console.log(response.locals.table,"localtable in occupiedStatus")
  if(request.body.data.reservation_id){
  const reservation= await serviceForReservation.read(request.body.data.reservation_id)
  if(reservation.status==="seated"){
    return next({status:400,message:"Reservation is already seated"})
  }
  }
  next()
}

function tableOccupied(request,response,next){
  if(response.locals.table.reservation_id===null){
    return next({status:400,message:"table is not occupied"})
  }
  next()
}
async function destroyResId(request,response,next){
  // const proofOfResRemoval=
  // console.log(request.body.data,"reqbodydata")
  const reservation_id=response.locals.table.reservation_id
  await serviceForReservation.updateStatus(reservation_id,"finished")
  const data = await service.destroyResId(Number(response.locals.table.table_id))
  response.status(200).json({data})
}

// function read(request, response){
//   const {reservationData}=response.locals
//   response
//   .status(201)
//   .json({data:reservationData})
// }

module.exports = {
  list:asyncErrorBoundary(list),
  create:[validFormSubmission,asyncErrorBoundary(create)],
  update:[asyncErrorBoundary(tableExists),asyncErrorBoundary(validSeating),asyncErrorBoundary(  occupiedStatus),asyncErrorBoundary(update)],
  destroyResId:[asyncErrorBoundary(tableExists),tableOccupied,asyncErrorBoundary( destroyResId)]
  // read:[asyncErrorBoundary(resExistsMidWare), read]
}
