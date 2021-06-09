import React, { useEffect,useState } from "react"
import {listSpecReservations} from "../utils/api"
import {useParams,useHistory,Link} from "react-router-dom"
import ErrorAlert from "../layout/ErrorAlert"

function SearchTables(props){
const{reservations}=props

const [searchedReservations,setSearchedTables]=useState(null)
const [phoneNumberSearching,setPhoneNumberSearching]=useState(null)
const [searchErrors,setSearchErrors]=useState(null)
const history=useHistory()


useEffect(searchTableGetter,phoneNumberSearching)
function searchTableGetter(){
if(phoneNumberSearching!==null){
    const abortController=new AbortController()
    const signal=abortController.signal
    setSearchErrors(null)
    listSpecReservations({mobile_phone:phoneNumberSearching},signal)
        .then(setSearchedTables)
}
// function handleChange(event){
//     event.preventDefault()

// }
}

function eachFoundReservation(){
    return searchedReservations.map((eachReservation)=>{
        const{first_name,last_name,mobile_number,reservation_time,people,status}=eachReservation
            return (<tr key={eachReservation.reservation_id}>
            <td><strong>{eachReservation.reservation_id}</strong></td>
            <td>{first_name}</td>
            <td>{last_name}</td>
            <td>{mobile_number}</td>
            <td>{reservation_time}</td>
            <td>{people}</td>
            <td data-reservation-id-status={eachReservation.reservation_id}>{status}</td>
            {status==="booked"?<td><a href={`/reservations/${eachReservation.reservation_id}/seat`}><button type="button">Seat</button></a></td>:null}
            {/* <td></td> */}
        </tr>)
        })
}

function formChangeHandler({target}){
    const value=target.value
    setPhoneNumberSearching(value)
}

function SearchForm(){
    return(
        <form onSubmit={searchTableGetter}>
            <label htmlFor="phone_number">Phone Number</label>
            <input 
            name="phone_number"
            id="phone_number"
            type="text" 
            placeholder="Enter a customer's phone number"
            value={phoneNumberSearching}
            onChange={formChangeHandler}
            required
            />
        </form>
    )
}

if(!reservations){
return (<div>
    <h4>No reservations to search...</h4>
    <Link to={`/reservations/new`}><button type="button">Add reservations</button></Link>
</div>)}

if(!searchedReservations){
    return(

        <div>
            <ErrorAlert error={searchErrors}/>
            <SearchForm/>
            <h4>No reservations found</h4>

            
        </div>
    )
}

return (
<div>
        <ErrorAlert error={searchErrors}/>
        <SearchForm/>
        <table>
        <caption>Reservations for this this phone number...</caption>
                <thead>
                    <tr>
                    <th scope="col">First Name</th>
                    <th scope="col">Last Name</th>
                    <th scope="col">Mobile Number</th>
                    <th scope="col">Reservation Time</th>
                    <th scope="col">People</th>
                    <th scope="col">Status</th>
                    <th scope="col">SEAT</th>
                    </tr>
                </thead>
                <tbody>
                    {eachFoundReservation()}
                </tbody>
                </table>
            
            {/*end reservations clause*/}

        </div>
    )
}
export default SearchTables