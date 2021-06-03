import React, {useState} from "react"
import {Link,useHistory} from "react-router-dom"
import {createReservation} from "../utils/api"

function ReservationNewComponent(){
        const blankForm={
                first_name:'',
                last_name:'',
                mobile_number:'',
                reservation_date:'',
                reservation_time:'',
                people:0
        }
        const history=useHistory()
        const [formState, setFormState]=useState(blankForm)
    //Some way to use a class constructor? Might be a good exercise which we had not applied in React initially
async function handleSubmit(event){
    console.log("submitted")
    event.preventDefault()
    const signal=new AbortController().signal
    //API post
    const response= await createReservation(formState,signal)
    //eventually API update
    console.log (response.data,"response body data")
        //use edit state for update instead of post?
        //possibly check response.body.error and set a state if it exists
        history.push(`/dashboard?date=${formState.reservation_date}`)

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
        <div><form onSubmit= {handleSubmit}>
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