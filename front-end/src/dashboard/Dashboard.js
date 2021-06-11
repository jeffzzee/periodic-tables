import React from "react";
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
function Dashboard({ 
  date, 
  reservationRefresh,
  setReservationRefresh, 
  reservations,
  setNewTableAddState,
  newTableAddState,
  reservationsError, 
  tables
}) {
  const history = useHistory()
 
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
      <div className="container">
      <div className="d-flex justify-content-center">

      <h1>Dashboard</h1>
      </div>
      <div className="d-md-flex mb-3">
        <h4 className="ml-4 mb-0">Reservations for {date}</h4>
      </div>
        <div className="col-sm-12 col-md-6 d-flex mb-3 justify-content-center">

      <button type="button" onClick={previousClickHandler}>Previous</button>
      <button type="button" onClick={todayClickHandler}>Today</button>
      <button type="button" onClick={nextClickHandler}>Next</button>
      </div>
        <div className="row">
        <div className="col-sm-12">
      <ErrorAlert 
        error={reservationsError} 
        />
      
      <ReservationDisplay 
        reservations={reservations}
        reservationRefresh={reservationRefresh}
        setReservationRefresh={setReservationRefresh}
        />
        </div>
        <div className="col-sm-12">

      <TablesDisplay
        reservationRefresh={reservationRefresh}
        setReservationRefresh={setReservationRefresh}
        tables={tables} 
        setNewTableAddState={setNewTableAddState} 
        newTableAddState={newTableAddState} 
        />
        </div>
        </div>
        <div className="row">
      </div>
        </div>
    </main>
  );
}

export default Dashboard;
