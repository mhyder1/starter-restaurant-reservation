import React, {useState, useEffect} from "react"
import useQuery from "../utils/useQuery"
import formatReadableDate from "../utils/format-readable-date";
import ErrorAlert from "../layout/ErrorAlert";
import DashboardDateNavigation from "./DashboardDateNavigation"
import ReservationsList from "../reservations/ReservationsList"
import TableList from "../tables/TableList"
import {listReservations, listTables} from "../utils/api"

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

 
  const reservationDate = formatReadableDate(date)
  
  return (
    <main>
      <h2 className="heading my-2 p-2">Dashboard</h2>
        <ErrorAlert error={reservationsError}/>
        <div className="d-md-flex flex-column mb-3">
          <span>
            <DashboardDateNavigation date = {date}/> 
          </span>

          <div className="group">
            <div className="item">
              <h3>Reservations for {reservationDate}</h3> 
                <ReservationsList reservations = {reservations}/>
            </div>
            <div className="item">
              <h3>Tables</h3>
                <TableList tables={tables}/> 
            </div>
          </div>
        </div>
  </main>
  
  );
}

export default Dashboard;
