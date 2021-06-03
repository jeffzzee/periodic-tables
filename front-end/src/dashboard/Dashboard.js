import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import{previous, today, next} from "../utils/date-time"
import{useHistory} from "react-router-dom"

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [dateSender, setDateSender]=useState(date)
  const history = useHistory()

  useEffect(loadDashboard, [dateSender]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date:dateSender }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }
  function previousClickHandler(){
    setDateSender(previous(dateSender))
    history.push(`/dashboard?date=${dateSender}`)
  }

  function todayClickHandler(){
    setDateSender(today())
    history.push(`/dashboard?date=${dateSender}`)
  }

  function nextClickHandler(){
    setDateSender(next(dateSender))
    history.push(`/dashboard?date=${dateSender}`)
  }


  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      {JSON.stringify(reservations)}
      <button type="button" onClick={previousClickHandler}>Previous</button>
      <button type="button" onClick={todayClickHandler}>Today</button>
      <button type="button" onClick={nextClickHandler}>Next</button>
    </main>
  );
}

export default Dashboard;
