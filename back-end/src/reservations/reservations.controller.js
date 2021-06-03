/**
 * List handler for reservation resources
 */

const service = require("./reservations.service");
const asyncErrorBoundary= require("../errors/asyncErrorBoundary");



async function resExistsMidWare(request,response,next){
  let foundReservation = ""
  const reservationId = request.params.reservation_id
  if (reservationId){
    foundReservation = await service.read(reservationId)
  }if(foundReservation){
    response.locals.reservationData = foundReservation
    next()
  }
  else{
  next({
    status: 404,
    message: `${reservationId} not found`
  })
  }
}



const fullForm=[
  "first_name","last_name","mobile_number","reservation_date","reservation_time","people"
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
  const reservationDate = new Date(`
  ${data.reservation_date}${data.reservation_time}`
  // ${data.reservation_test} GMT-0500
  )
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
      message: "Invalid data format provided. Requires {string:[first_name, last_name, mobile_number], date: reservation_date, time: reservation_time, number: people}"
    }) //if false go to error handler
  }
  if (typeof data.people !== "number") {
    return next({
      status: 400,
      message: "Needs to be a number, people is not a number.",
    });
  }
  if (data.people < 1){
    return next({
      status: 400,
      message: "people needs to be a number greater than 0",
    });
  }
  
  if (!/\d{4}-\d{2}-\d{2}/.test(data.reservation_date)) {
    return next({
      status: 400,
      message: "reservation_date is not a date.",
    });
  }
  if (reservationDate.getDay() === 1) {
    return next({
      status: 400,
      message:
      "Reservations cannot be made on a Tuesday, the restaurant is closed.",
    });
  }
  // start = new Date(${data.reservation_date} 10:30:00 GMT-500),
  // end = new Date(${data.reservation_date} 21:30:00 GMT-500);
  
  if(reservationDate < new Date().getTime()){
    return next({
      status:400,
      message: "reservations must be made for the future"
    })
  }
  
  if (!/[0-9]{2}:[0-9]{2}/.test(data.reservation_time)) {
    return next({
      status: 400,
        message: "reservation_time is not a time.",
      });
    }
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
              if (data.reservation_time<"10:30"||data.reservation_time>"21:30"){
                return next ({
                  status:400,
                  message:"reservation cannot be made before 10:30am or after 9:30pm."
                })
              }
              next();
            }
            
            
            
            
            /*function dateChecker(date){
  if (date)
}
function timeChecker(time){
  
}*/
async function create(request,response){
  const newReservationObject={
    first_name:request.body.data.first_name,
    last_name:request.body.data.last_name,
    reservation_time:request.body.data.reservation_time,
    reservation_date:request.body.data.reservation_date,
    mobile_number:request.body.data.mobile_number,
    people:request.body.data.people
  } 
  const newReservationSuccess = await service.create(newReservationObject);
  response
  .status(201)
  .json({data: newReservationSuccess})
}

async function list(request, response) {
  const date=request.query.date
  const reservationsThisDate = await service.list(date)
  response.json({data:reservationsThisDate
  });
}

function read(request, response){
  const {reservationData}=response.locals
  response
  .status(201)
  .json({data:reservationData})
}

module.exports = {
  list:asyncErrorBoundary(list),
  create:[validFormSubmission,asyncErrorBoundary(create)],
  read:[asyncErrorBoundary(resExistsMidWare), read]
};
