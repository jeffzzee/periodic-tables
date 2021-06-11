// import React,{useState,useEffect} from "react"
// import {reservationStatusUpdate} from "../utils/api"

// function cancelReservationHandler({target}){
//     if (window.confirm("Do you want to cancel this reservation? This cannot be undone.")) {
//     const resID =target.getAttribute("data-reservation-id")
//     const reservationRefresh = target.getAttribute("data-refresher")
//     const reservationRefreshCounter=target.getAttribute("data-refreshcount")
//     console.log("attribute gotten",resID)
//     const abortController=new AbortController()
//     //no useEffect necessary for an onClick event API
//     reservationStatusUpdate(resID,"cancelled", abortController.signal)
//     .then(()=>reservationRefresh(reservationRefreshCounter+1))
//     // .catch(setDeleteErrors)
//     }
// }
// export default cancelReservationHandler
