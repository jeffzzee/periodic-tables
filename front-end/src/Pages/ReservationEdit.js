import React, { useEffect,useState } from "react"
import ReservationNewComponent from "./ReservationNewComponent"
import {useParams} from "react-router-dom"


function ReservationEdit(props){
    const{
    reservationRefresh,
    setReservationRefresh
    }=props
    const [editState,setEditState]=useState(null)//use for edit res target 
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