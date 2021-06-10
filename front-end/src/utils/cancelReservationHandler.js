import React,{useState,useEffect} from "react"

function cancelReservationHandler({target}){
    const resID =target.getAttribute("data-reservation-id")
    console.log("attribute gotten",resID)
    const abortController=new AbortController()
    //no useEffect necessary for an onClick event API
    deleteReservationAPI(resID, abortController.signal)
    .then(()=>)
    .catch(setDeleteErrors)

}
export default cancelReservationHandler