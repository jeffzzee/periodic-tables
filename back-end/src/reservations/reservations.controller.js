/**
 * List handler for reservation resources
 */

const service = require("./reservations.service");
const asyncErrorBoundary= require("../errors/asyncErrorBoundary");



//quick API reservation finder
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

//pulled from front end utils/date-time
function asDateString(date) {
  return `${date.getFullYear().toString(10)}-${(date.getMonth() + 1)
    .toString(10)
    .padStart(2, "0")}-${date.getDate().toString(10).padStart(2, "0")}`;
}
function today() {
  return asDateString(new Date());
}

//all required form items
const fullForm=[
  "first_name","last_name","mobile_number","reservation_date","reservation_time","people"
]

//all form keys have a value
function emptyCheck(input){
  for (let key in input){
    if (!input[key]){
      return false
    }
  }
  return true
}

//check validity of reservation form fields
function validFormSubmission(request,response,next){
  const {data={}}=request.body //pulls data from request or uses empty object by default
  const reservationDate = new Date(data.reservation_date//make the submitted date a Date object
  )

  //check form submission elements existence
  const dataKeys = Object.keys(data)//array of all keys in the submitted data
  fullForm.forEach((item)=>{
    if(!dataKeys.includes(item)){//if the request is missing a fullform element
      return next({
        status: 400,
        message: `The ${item} is missing`
      })
    }
  })

  //check if any field is blank
  if (!emptyCheck(data)) {//send request data to null checker emptyCheck
    return next({
      status: 400,
      message: "Invalid data format provided. Requires {string:[first_name, last_name, mobile_number], date: reservation_date, time: reservation_time, number: people}"
    })
  }

  //check that reservation people is a number
  if (typeof data.people !== "number") {
    return next({
      status: 400,
      message: "Needs to be a number, people is not a number.",
    });
  }

  //check that reservation people is greater than 0
  if (data.people < 1){
    return next({
      status: 400,
      message: "people needs to be a number greater than 0",
    });
  }
  
  //check that reservation date is in the future
  if(isReservationPast(data.reservation_date)){
    return next({
      status:400,
      message:"reservation date must be made for the future"
    })
  }

  //check that reservation date is in the right format YYYY-MM-DD
  if (!/\d{4}-\d{2}-\d{2}/.test(data.reservation_date)) {
    return next({
      status: 400,
      message: "reservation_date is not a date.",
    });
  }

  //check reservation day for Tuesday
  if (reservationDate.getDay() === 1) {
    console.log("tuesday tested")
    return next({
      status: 400,
      message:
      "reservation_date cannot be made on a Tuesday, the restaurant is closed.",
    });
  }

  //create a comparison date for the present day and time
  const now=today()
  //extends the date/time continuum to milliseconds for comparison of past
  const reserveDateTime=new Date(`${data.reservation_date}T${data.reservation_time}:00.000`)

  //is reserved time before the present?
  if (reserveDateTime<now){
    return next({status:400,message:"reservation_time must be in the future."})
  }
  //is reserved time is reserved time before opening time?
  if(reserveDateTime.getHours()===10&&reserveDateTime.getMinutes()<30){
    return next({status:400,message:"reservation_time must come after our opening time of 10:30am"})
  }
  //is reserved time too close to closing  time?
  if(reserveDateTime.getHours()===9&&reserveDateTime.getMinutes()>30){
    return next({status:400,message:"reservation_time must be made an hour before our closing time of 10:30pm"})
  }
  
  //is reserved time a proper time format?
  if (!/[0-9]{2}:[0-9]{2}/.test(data.reservation_time)) {
    return next({
      status: 400,
      message: "reservation_time is not a time.",
    });
  }

  //is reserved time outside of business reservation hours
  if (data.reservation_time<"10:30"||data.reservation_time>"21:30"){
    return next ({
      status:400,
      message:"reservation cannot be made before 10:30am or after 9:30pm."
    })
  }
  //if no errors move to the next middleware
  next();
}

//date past present helper function
function isReservationPast(date) {
  const temp = date.split("-");
  const newDate = new Date(
    Number(temp[0]),
    Number(temp[1]) - 1,
    Number(temp[2]) + 1
  );

  return newDate.getTime() < new Date().getTime();
} 

//create service call
async function create(request,response){
  //construct full checked form with proper keys
  const newReservationObject={
    first_name:request.body.data.first_name,
    last_name:request.body.data.last_name,
    reservation_time:request.body.data.reservation_time,
    reservation_date:request.body.data.reservation_date,
    mobile_number:request.body.data.mobile_number,
    people:request.body.data.people
  } 
  //send object to reservation service to be added to the table
  const newReservationSuccess = await service.create(newReservationObject);
  response
  .status(201)
  .json({data: newReservationSuccess})
}

//Get a list of matching reservations from the table using date or mobile number
async function list(request, response) {
  // console.log(request.query.date,request.query.mobile_number) //uncomment to check query
  const date=request.query.date
  const mobile_number=request.query.mobile_number

  const reservationsThisQuery = await service.list(date, mobile_number)
  response.json({data:reservationsThisQuery
  });
}

//send found reservation back
function read(request, response){
  const {reservationData}=response.locals
  response
  .status(200)
  .json({data:reservationData})
}

//legit statuses in an array
const realStatus=["booked","finished","cancelled","seated"]

//check existence and legitimacy of status
function statusCheck(request,response,next){
  if(!request.body.data.status){
    return next({status:400,message:"no status defined"})
  }
  const {status}=request.body.data
  response.locals.status=status
  if(!realStatus.includes(status)){
    return next({status:400,message:`${status} is unknown. It must be booked, seated, cancelled or finished`})
  }
  
  next()

}

//Make sure status is not finished
function notFinished(request,response,next){
  if(response.locals.reservationData.status==="finished"){
    return next({status:400,message:"The reservation is already finished"})
  }
  return next()
}

//Make sure status is a legitimate option
function statusCreateCheck(request,response,next){
  const {status}=request.body.data
  if(status&&status!=="booked"){
    return next({status:400,message:"Status must be booked, seated, cancelled or finished"})
  }
  next()
}

//Check that reservation's existing status is currently booked
function statusUpdateCheck(request,response,next){
  const {status}=response.locals.reservationData
  if(status!=="booked"){
    return next({status:400,message:"Status must be booked"})
  }
  next()
  }

//update the reservation status in the reservations table
async function updateStatus(request,response,next){
  const {status="booked"}=request.body.data
  const reservationID=request.params.reservation_id
  const updatedStatus= await service.updateResStatus(reservationID,status)
  response
    .status(200)
    .json({data:updatedStatus})
}

//update  the reservation table with updated information
async function update(request,response,next){
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
  response
    .status(200)
    .json({data:updatedRes})
}

//export with array of middleware defined
module.exports = {
  list:asyncErrorBoundary(list),
  create:[
    validFormSubmission,
    statusCreateCheck,
    asyncErrorBoundary(create)],
  read:[
    asyncErrorBoundary(resExistsMidWare), 
    read],
  update:[
    asyncErrorBoundary(resExistsMidWare),
    validFormSubmission,
    statusUpdateCheck,
    asyncErrorBoundary(update)],
  updateStatus:[
    asyncErrorBoundary(resExistsMidWare),
    statusCheck, 
    notFinished, 
    asyncErrorBoundary(updateStatus)],
};
