import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import{previous, today, next} from "../utils/date-time"
import{useHistory} from "react-router-dom"
import ReservationDisplay from "../components/ReservationDisplay"
import TablesDisplay from "../components/TablesDisplay"

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date, loadDashboard,reservationRefresh,
  setReservationRefresh, reservations,setNewTableAddState,newTableAddState,
 reservationsError, tables}) {
  const history = useHistory()

  // useEffect(loadDashboard, [date]);

  
  function previousClickHandler(){

    history.push(`/dashboard?date=${previous(date)}`)
  }

  function todayClickHandler(){

    history.push(`/dashboard?date=${today()}`)
  }

  function nextClickHandler(){

    history.push(`/dashboard?date=${next(date)}`)
  }


  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <ReservationDisplay reservations={reservations}
      reservationRefresh={reservationRefresh}
      setReservationRefresh={setReservationRefresh}
      />
      <TablesDisplay
       reservationRefresh={reservationRefresh}
       setReservationRefresh={setReservationRefresh}
       tables={tables} setNewTableAddState={setNewTableAddState} newTableAddState={newTableAddState} 
       />
      

      <button type="button" onClick={previousClickHandler}>Previous</button>
      <button type="button" onClick={todayClickHandler}>Today</button>
      <button type="button" onClick={nextClickHandler}>Next</button>
    </main>
  );
}

export default Dashboard;
