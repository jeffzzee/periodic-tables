import React, {useEffect,useState} from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import {listReservations,listTables} from "../utils/api"
import useQuery from "../utils/useQuery"
import ReservationNewComponent from "../pages/ReservationNewComponent";
import SeatingFolk from "../pages/SeatingFolk"
import SearchTables from "../pages/Search"
import TableNew from "../pages/TableNew"
import ReservationEdit from "../pages/ReservationEdit"

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables]=useState([])
  const [tablesError, setTablesError]=useState(null)
  const [newTableAddState,setNewTableAddState] = useState(0)
  const [reservationRefresh,setReservationRefresh]=useState(0)
  const query = useQuery();
  const date = query.get("date")?query.get("date"):today();

  
  useEffect(loadDashboard, [date,reservationRefresh]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  useEffect(loadTables,[newTableAddState,date])

  function loadTables(){
    const abortController = new AbortController();
    setTablesError(null);
    listTables({ date }, abortController.signal)//no date needed, but no issue sending?
      .then(setTables)
      .catch(setTablesError);
    return () => abortController.abort();
  }


  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations/new">
        <ReservationNewComponent 
          date={date} 
          loadDashboard={loadDashboard}
          reservationRefresh={reservationRefresh}
          setReservationRefresh={setReservationRefresh}
        />  
      </Route>
      <Route path="/reservations/:reservation_id/seat">
        <SeatingFolk 
          tables={tables} 
          reservations={reservations}
          newTableAddState={newTableAddState}
          setNewTableAddState={setNewTableAddState}
          reservationRefresh={reservationRefresh}
          setReservationRefresh={setReservationRefresh}
        />
      </Route>
      <Route path="/reservations/:reservation_id/edit">
        <ReservationEdit 
          tables={tables} 
          reservations={reservations}
          newTableAddState={newTableAddState}
          setNewTableAddState={setNewTableAddState}
          reservationRefresh={reservationRefresh}
          setReservationRefresh={setReservationRefresh}
        />
      </Route>
      <Route path="/search">
        <SearchTables 
          newTableAddState={newTableAddState}
          setNewTableAddState={setNewTableAddState}
          reservationRefresh={reservationRefresh}
          setReservationRefresh={setReservationRefresh}
        />
      </Route>
      <Route path="/dashboard">
        <Dashboard 
          date={date}
          loadDashboard={loadDashboard} 
          setReservationsError={setReservationsError}
          reservationsError={reservationsError} 
          reservations={reservations}
          tables={tables}
          tablesError ={tablesError }
          setNewTableAddState={setNewTableAddState}
          newTableAddState={newTableAddState}
          setTablesError={setTablesError}
          reservationRefresh={reservationRefresh}
          setReservationRefresh={setReservationRefresh}
       />
      </Route>
      <Route path="/tables/new">
        <TableNew 
          loadDashboard={loadDashboard}
          newTableAddState={newTableAddState}
          setNewTableAddState={setNewTableAddState}
        />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
