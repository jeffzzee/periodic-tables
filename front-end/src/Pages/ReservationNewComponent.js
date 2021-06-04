import React, {useState} from "react"
import {Link,useHistory} from "react-router-dom"
import {createReservation} from "../utils/api"
import{today} from "../utils/date-time"
import ErrorAlert from "../layout/ErrorAlert"

function ReservationNewComponent({loadDashboard, date}){
        const blankForm={ //initialized empty form
                first_name:'',
                last_name:'',
                mobile_number:'',
                reservation_date:'',
                reservation_time:'',
                people:0
        }
        const history=useHistory() //for links 
        const [formState, setFormState]=useState(blankForm) //for form values
        const [errorCollector, setErrorCollector]=useState(null)//for front end validation
        const todayDateObject=today() //defaults to today (used in 2 helper functions )
        
        function dateCheck(){
                const dateErrors=[] //error holder
                const dateObject=new Date(formState.reservation_date) //creates a Date object from argument
                //use .getDay for index of week's day
                if (dateObject.getDay()===1){//Tuesday zero indexed is 1 (from Monday=0)
                //error object w/ message created for Tuesday
                        dateErrors.push("Reservations cannot be made on Tuesday; the restaurant is closed on Tuesday")

                }
                if(dateObject < todayDateObject){ //smaller date is earliest
                        //push error object message for past date reservation submission
                        dateErrors.push("Reservations must be made on a future date and cannot be made in the past")
                }
                if (dateErrors.length===0){ //if error state has NO content return true
                        return true
                }
                else{
                        setErrorCollector(new Error(dateErrors.toString()));
                        // setErrorCollector(dateErrors)//place errors objects into state
                        return false //otherwise return false
                }
        }
        function timeCheck(){
                const timeErrors = []
                console.log(todayDateObject,"the today object from today()")
                const reserveDateTime=new Date(`${formState.reservation_date}T${formState.reservation_time}:00.000`)//extends the date/time continuum for comparison of past
                if (reserveDateTime<todayDateObject){
                        timeErrors.push("reservation must be made on a future date and cannot be made in the past")
                }
                if (reserveDateTime.getHours<11 && reserveDateTime.getMinutes()<30)
                        timeErrors.push("Reservation cannot be made before we are open. We are closed until 10:30AM")
                if (reserveDateTime.getHours() === 21 && reserveDateTime.getMinutes()>30){
                        timeErrors.push("Reservations must be made an hour before close at 10:30PM")
                }
                if (timeErrors.length===0){
                        return true
                }else{
                        setErrorCollector(...errorCollector, new Error(timeErrors.toString()))
                        return false
                }
        }

    //Some way to use a class constructor? Might be a good exercise which we had not applied in React initially
function handleSubmit(event){

    event.preventDefault() //submission default prevention
        setErrorCollector(null)
    const signal=new AbortController().signal //create an abort controller instance signal 
        //check form's date submission locally on front end first
        if (dateCheck()){//if no errors then true
                //API post
                if(timeCheck()){
                        createReservation(formState,signal) //actual API call via imported Util
                        .then(()=>loadDashboard())
                        .then(()=> history.push(`/dashboard?date=${formState.reservation_date}`))//send user to reservation date URL)
                        .catch(setErrorCollector)
                //eventually API update
                // console.log (response.data,"response body data")
                //use edit state for update instead of post?
                //possibly check response.body.error and set a state if it exists
                }
        }
}

function changeHandler({target}){
        let value=target.value
        if (target.name==="people"){
                
                value=Number(target.value)
                console.log(target.value)
        }
        setFormState({...formState, [target.name]:value})
}
    return (

        <div>
                <ErrorAlert error={errorCollector}/>
                <form onSubmit= {handleSubmit}>
        <label htmlFor="first_name">First Name:</label>
        <input
                name="first_name"
                id="first_name"
                type="text"
                // defaultValue=
                onChange={changeHandler}
                value={formState.first_name}
                placeholder="First Name"
                required
        />
        <br />
        <label htmlFor="last_name" >Last Name:</label>
        <input
                name="last_name"
                id="last_name"
                type="text"
                // defaultValue=
                onChange={changeHandler}
                value={formState.last_name}
                placeholder="Last Name"
                required
        />
        <br />
        <label htmlFor="mobile_number">Phone:</label>
        <input
                name="mobile_number"
                id="mobile_number"
                type="tel"
                // pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                // defaultValue=
                onChange={changeHandler}
                value={formState.mobile_number}
                placeholder="XXX-XXX-XXXX"
                required
        />
        <br />
        
        <label >Reservation Date:</label>
        <input
                name="reservation_date"
                id="reservation_date"
                type="date"
                // defaultValue=
                onChange={changeHandler}
                value={formState.reservation_date}
                placeholder="Date"
                required
        />
        <br />
        <label >Reservation Time:</label>
        <input
                name="reservation_time"
                id="reservation_time"
                type="time"
                // defaultValue=
                onChange={changeHandler}
                value={formState.reservation_time}
                // placeholder=
                required
        />
        <br />
        <label >Number of People:</label>
        <input
                name="people"
                id="people"
                type="number"
                min="1"
                step="1"
                onChange={changeHandler}
                value={formState.people}
                placeholder="Party Number"
                required
        />
        <br />
        <button type="submit" value="Submit" >Submit</button>
        <button type="button" onClick={history.goBack} >Cancel</button>
    </form></div>
    )
}
export default ReservationNewComponent