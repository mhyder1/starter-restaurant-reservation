
//import {useHistory} from "react-router-dom"
import React, {useState, useEffect} from "react"
import useQuery from "../utils/useQuery"
import formatReadableDate from "../utils/format-readable-date";
import ErrorAlert from "../layout/ErrorAlert";
import DashboardDateNavigation from "./DashboardDateNavigation"
import ReservationsList from "../reservations/ReservationsList"
import TableList from "../tables/TableList"
import {listReservations, listTables} 
  from "../utils/api"
//import {today} from "../utils/date-time"


/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({date}) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null)
  const [tables, setTables] = useState([])
  //const [tablesError, setTablesError] = useState(null)
  
  const dateQuery = useQuery().get("date")

  if(dateQuery && dateQuery !== ""){
    date = dateQuery
  }
  console.log(date)
  
useEffect(loadDashboard, [date]);

function loadDashboard() {
  const abortController = new AbortController();
  setReservationsError(null);
  listReservations({ date }, abortController.signal)
    .then(setReservations)
    .catch(setReservationsError);
  listTables(abortController.signal)
    .then(setTables)
    .catch(setReservationsError);

  return () => abortController.abort();
}


  //const history = useHistory();
 
  const reservationDate = formatReadableDate(date)
  
  return (
    <main>
      <h2 className="heading d-md-flex my-3 p-2">Dashboard</h2>
      <ErrorAlert error={reservationsError}/>
      <div className="d-md-flex mb-3">
        <div className="mb-3">
        <h4 className="mb-0">Reservations for {reservationDate}</h4>
          <DashboardDateNavigation date = {date}/> 
        </div>
       {/* <ErrorAlert error = {tablesError}/>  */}
        <div className="d-flex flex-column mb-3 mx-3">
          <ReservationsList reservations = {reservations}/>
          <h4>Tables</h4>
            <TableList tables={tables}/> 
        </div>
        </div>
      {/* {JSON.stringify(reservations)}  */}
  </main>
  
  );
}

export default Dashboard;
