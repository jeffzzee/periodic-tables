import React, { useEffect,useState } from "react"
import {listSpecReservations} from "../utils/api"
import {useParams,useHistory,Link} from "react-router-dom"
import ErrorAlert from "../layout/ErrorAlert"

function SearchTables(props){
const{
    // reservations //don't use date specific res
    newTableAddState,
        setNewTableAddState
}=props

const [searchedReservations,setSearchedReservations]=useState(null)
const [phoneNumberSearching,setPhoneNumberSearching]=useState('')
const [searchErrors,setSearchErrors]=useState(null)
const history=useHistory()


// useEffect(searchTableGetter,[phoneNumberSearching])//doesn't repeat, only fires on event
function searchTableGetter(event){
    event.preventDefault()
    console.log("search submit function called")
    console.log(phoneNumberSearching,phoneNumberSearching.length!==0)
    if(phoneNumberSearching&&phoneNumberSearching.length!==0){
    const abortController=new AbortController()
    const signal=abortController.signal
    console.log("abortcontrollersetupreached")
    setSearchErrors(null)
    listSpecReservations({mobile_phone:phoneNumberSearching},signal)
        .then(setSearchedReservations)
        // .then((x)=>setNewTableAddState(newTableAddState+1))
        .then(()=>console.log("we got here"))
        .catch(setSearchErrors)
        // .catch((error)=>console.log(error))

    return()=>abortController.abort()
}
// function handleChange(event){
//     event.preventDefault()

// }
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
                            </tr>
                        )
                    })
                    }      
                </tbody>
            </table>
        )
    }
}


function formChangeHandler({target}){
    const value=target.value
    console.log(value,"value from form")
    setPhoneNumberSearching(value)
}

function SearchForm({phoneNumberSearching,setPhoneNumberSearching}){
    return(
        <form onSubmit={searchTableGetter}>
            <label htmlFor="mobile_number">Phone number to find</label>
            <input 
            name="mobile_number"
            id="mobile_number"
            type="input" 
            placeholder="XXX-XXX-XXXX"
            value={phoneNumberSearching}
            onChange={formChangeHandler}
            required
            />
            <button type="submit" >Submit</button>
        </form>
    )
}

// if(!reservations){
// return (<div>
//     <h4>No reservations to search...</h4>
//     <Link to={`/reservations/new`}><button type="button">Add reservations</button></Link>
// </div>)}

// if(!searchedReservations){
//     return(

//         <div>
//             <ErrorAlert error={searchErrors}/>
//             <SearchForm/>
//             <h4>No reservations found</h4>

            
//         </div>
//     )
// }

return (
        <div>
            <ErrorAlert error={searchErrors}/>
            <SearchForm 
            phoneNumberSearching={phoneNumberSearching},
            setPhoneNumberSearching={setPhoneNumberSearching}/>
            {eachFoundReservation()}
        </div>
    )
}
export default SearchTables