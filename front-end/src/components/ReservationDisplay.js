import React from "react"
import{Link}from "react-router-dom"

function ReservationDisplay(props){
    const {reservations,reservationRefresh,
    setReservationRefresh}=props
    const{first_name,last_name,mobile_number,reservation_time,people,status}=reservations
    
    function eachReservation(){
        return reservations.map((eachReservation)=>{
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

    if(!reservations){
        return(<div>
            <h4>No Reservations for this date... Add reservations at </h4>
        </div>)}

    return(
        <div>
            <table>
                <caption>Reservations for this date...</caption>
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
                    {eachReservation()}
                </tbody>
                </table>
            
            {/*end reservations clause*/}

        </div>
    )
}
export default ReservationDisplay