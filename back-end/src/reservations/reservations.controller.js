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

function asDateString(date) {
  return `${date.getFullYear().toString(10)}-${(date.getMonth() + 1)
    .toString(10)
    .padStart(2, "0")}-${date.getDate().toString(10).padStart(2, "0")}`;
}
function today() {
  return asDateString(new Date());
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
  const reservationDate = new Date(data.reservation_date
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
  
  if(isReservationPast(data.reservation_date)){
    return next({
      status:400,
      message:"reservation date must be made for the future"
    })
  }

  if (!/\d{4}-\d{2}-\d{2}/.test(data.reservation_date)) {
    return next({
      status: 400,
      message: "reservation_date is not a date.",
    });
  }
  if (reservationDate.getDay() === 1) {
    console.log("tuesday tested")
    return next({
      status: 400,
      message:
      "reservation_date cannot be made on a Tuesday, the restaurant is closed.",
    });
  }
  // start = new Date(${data.reservation_date} 10:30:00 GMT-500),
  // end = new Date(${data.reservation_date} 21:30:00 GMT-500);
  
  // if(reservationDate < new Date().getTime()){
  //   console.log("future tested")
  //   return next({
  //     status:400,
  //     message: "reservations must be made for the future"
  //   })
  // }
  const now=today()
  const reserveDateTime=new Date(`${data.reservation_date}T${data.reservation_time}:00.000`)//extends the date/time continuum for comparison of past
  if (reserveDateTime<now){
    return next({status:400,message:"reservation_time must be in the future."})
  }
  if(reserveDateTime.getHours()===10&&reserveDateTime.getMinutes()<30){
    return next({status:400,message:"reservation_time must come after our opening time of 10:30am"})
  }
  if(reserveDateTime.getHours()===9&&reserveDateTime.getMinutes()>30){
    return next({status:400,message:"reservation_time must be made an hour before our closing time of 10:30pm"})
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
function isReservationPast(date) {
  const temp = date.split("-");
  const newDate = new Date(
    Number(temp[0]),
    Number(temp[1]) - 1,
    Number(temp[2]) + 1
  );
  // indexing for the months etc.
  return newDate.getTime() < new Date().getTime();
} 

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

// async function list(request, response) {
//   console.log("made it to the reservation controller...")
//   if(request.query.date){
//     const date=request.query.date
//     const reservationsThisDate = await service.list({date})
//     response
//     .json({data:reservationsThisDate
//     });
//   }else if(request.query.mobile_phone)
//   const mobile_number=request.query.mobile_number
//   const reservationsThisPhone = await service.list({mobile_number})
//   response
//   .json({data:reservationsThisPhone
//   });
// }


//uncorrupted prior to phone number query merge
async function list(request, response) {
  console.log(request.query.date,request.query.mobile_number)
  const date=request.query.date
  const mobile_number=request.query.mobile_number

  const reservationsThisQuery = await service.list(date, mobile_number)
  response.json({data:reservationsThisQuery
  });
}


function read(request, response){
  const {reservationData}=response.locals
  response
  .status(200)
  .json({data:reservationData})
}

const realStatus=["booked","finished","cancelled","seated"]

function statusCheck(request,response,next){
  console.log("status check",request.body.data)
  if(!request.body.data.status){
    return next({status:400,message:"no status defined"})
  }
  const {status}=request.body.data
  response.locals.status=status
  console.log("status check in update",status)
  if(!realStatus.includes(status)){
    return next({status:400,message:`${status} is unknown. It must be booked, seated, cancelled or finished`})
  }
  
  next()

}
function notFinished(request,response,next){
  if(response.locals.reservationData.status==="finished"){
  console.log("failed on not finished",response.locals)
 return next({status:400,message:"The reservation is already finished"})
}
  return next()


}
function statusCreateCheck(request,response,next){
//   if(!request.body.data.status){
// return next({status:400,message:"no status defined"})}
const {status}=request.body.data
// console.log("status check",status)
if(status&&status!=="booked"){
  return next({status:400,message:"Status must be booked, seated, cancelled or finished"})
}
next()
}

//perhaps check reservation existing status?
function statusUpdateCheck(request,response,next){
  //   if(!request.body.data.status){
  // return next({status:400,message:"no status defined"})}
  const {status}=response.locals.reservationData
  // console.log("status check",status)
  if(status!=="booked"){
    return next({status:400,message:"Status must be booked"})
  }
  next()
  }


async function updateStatus(request,response,next){
  // console.log(updatedStatus,"updated status from knex service")
  const {status="booked"}=request.body.data
  const reservationID=request.params.reservation_id
  const updatedStatus= await service.updateResStatus(reservationID,status)
  console.log("XXXXXX",updatedStatus)
  response
  .status(200)
  .json({data:updatedStatus})

}

async function update(request,response,next){
  const {data}=request.body
  const updatedReservation={
    ...response.locals.reservationData,
    first_name:request.body.data.first_name,
    last_name:request.body.data.last_name,
    reservation_time:request.body.data.reservation_time,
    reservation_date:request.body.data.reservation_date,
    mobile_number:request.body.data.mobile_number,
    people:request.body.data.people
  }
  const updatedRes= await service.updateRes(response.locals.reservationData.reservation_id,updatedReservation)
  console.log("XXXXXX",updatedRes)
  response
  .status(200)
  .json({data:updatedRes})

}

// async function deleteReservation(request, response,next){
//   const resID=request.params.reservation_id//use url param for resID
//   await service.deleteReservation(re)
// }

module.exports = {
  list:asyncErrorBoundary(list),
  create:[validFormSubmission,
    statusCreateCheck,
    asyncErrorBoundary(create)],
  read:[asyncErrorBoundary(resExistsMidWare), read],
  update:[asyncErrorBoundary(resExistsMidWare),validFormSubmission,statusUpdateCheck,asyncErrorBoundary(update)],
  updateStatus:[asyncErrorBoundary(resExistsMidWare),statusCheck, notFinished, asyncErrorBoundary(updateStatus)],
  // destroy:[asyncErrorBoundary(resExistsMidWare),asyncErrorBoundary( deleteReservation)]
};
