import React, { useState } from "react"
import {listSpecReservations} from "../utils/api"
import ErrorAlert from "../layout/ErrorAlert"
import SearchForm from "./SearchForm"
import {reservationStatusUpdate} from "../utils/api"

function SearchTables(props){
const{
    newTableAddState,
    setNewTableAddState,
    reservationRefresh,
    setReservationRefresh
}=props

const [searchedReservations,setSearchedReservations]=useState(null)
const [phoneNumberSearching,setPhoneNumberSearching]=useState('')
const [searchErrors,setSearchErrors]=useState(null)

function searchTableGetter(event){
    event.preventDefault()
    if(phoneNumberSearching&&phoneNumberSearching.length!==0){
        const abortController=new AbortController()
        const signal=abortController.signal
            setSearchErrors(null)
        listSpecReservations({mobile_number:phoneNumberSearching},signal)
            .then(setSearchedReservations)
            .then((x)=>setNewTableAddState(newTableAddState+1))
            .then(()=>console.log("we got here",searchedReservations))
            .catch(setSearchErrors)
        return()=>abortController.abort()
    }
}
function cancelReservationHandler({target}){
    if (window.confirm("Do you want to cancel this reservation? This cannot be undone.")) {
    const resID =target.getAttribute("data-reservation-id")
    const abortController=new AbortController()
    reservationStatusUpdate(resID,"cancelled", abortController.signal)
    .then(()=>setReservationRefresh(reservationRefresh+1))
    }
}

function eachFoundReservation(){
    if(searchedReservations&&searchedReservations.length>0){
        return(
            <table>
            <caption>Reservations for this this phone number...</caption>
                <thead>
                    <tr>
                        <th scope="col">First Name</th>
                        <th scope="col">Last Name</th>
                        <th scope="col">Phone</th>
                        <th scope="col">Time</th>
                        <th scope="col">People</th>
                        <th scope="col">Status</th>
                        <th scope="col">SEAT</th>
                        <th scope="col">Edit</th>
                        <th scope="col">Cancel</th>
                    </tr>
                </thead>
                <tbody>
                    {searchedReservations.map((eachReservation)=>{
                        const{
                            first_name,
                            last_name,
                            mobile_number,
                            reservation_time,
                            people,
                            status}
                        =eachReservation
                        return (
                            <tr key={eachReservation.reservation_id}>
                                <td><strong>{eachReservation.reservation_id}</strong></td>
                                <td>{first_name}</td>
                                <td>{last_name}</td>
                                <td>{mobile_number}</td>
                                <td>{reservation_time}</td>
                                <td>{people}</td>
                                <td data-reservation-id-status={eachReservation.reservation_id}>{status}</td>
                            {status==="booked"?
                                <td>
                                    <a href={`/reservations/${eachReservation.reservation_id}/seat`}>
                                        <button type="button">Seat</button>
                                    </a>    
                                </td>
                            :
                                null
                            }
                            {status==="booked"?
                                <td>
                                    <a href={`/reservations/${eachReservation.reservation_id}/edit`}>
                                        <button type="button">Edit</button>
                                    </a>    
                                </td>
                            :
                                null
                            }
                            {status==="booked"?
                                <td>
                                    <button 
                                    type="button" 
                                    data-reservation-id={eachReservation.reservation_id} 
                                    data-reservation-id-cancel={eachReservation.reservation_id} 
                                    onClick={cancelReservationHandler}
                                    >
                                    Cancel
                                    </button>
                                </td>
                            :
                                null
                            }
                            </tr>
                        )
                    })
                    }      
                </tbody>
            </table>
        )
    }
    return(
        <div>
            <h4>No reservations found</h4>
        </div>)
}

return (
        <div>
            <ErrorAlert error={searchErrors}/>
            <SearchForm 
            phoneNumberSearching={phoneNumberSearching}
            searchTableGetter={searchTableGetter}
            setPhoneNumberSearching={setPhoneNumberSearching}/>
            {eachFoundReservation()}
        </div>
    )
}
export default SearchTables