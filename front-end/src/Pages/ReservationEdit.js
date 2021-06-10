import React, { useEffect } from "react"
import ReservationNewComponent from "./ReservationNewComponent"
import {useParams} from "react-router-dom"


function ReservationEdit(props){
    const{
    tables, 
    reservations,
    newTableAddState,
    setNewTableAddState,
    editState,
    setEditState,
    reservationRefresh,
    setReservationRefresh}=props
        console.log("reservationEdit")
        //Probably just redirect to the create form with a token? Probably...
        const {reservation_id}=useParams()//gets reservation to edit from URL
        const resID=reservation_id
        useEffect(setTheResToEdit,[resID,setEditState])
    function setTheResToEdit(){
        setEditState(resID)//sets child accessible ID as state 
        }


        return (<div>
            <ReservationNewComponent 
            editState={editState}
            setEditState={setEditState}
            reservationRefresh={reservationRefresh}
            setReservationRefresh={setReservationRefresh}/>
        </div>)

}
export default ReservationEdit