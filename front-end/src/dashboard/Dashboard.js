
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
  const [tablesError, setTablesError] = useState(null)
  
  const dateQuery = useQuery().get("date")

  if(dateQuery && dateQuery !== ""){
    date = dateQuery
  }
  console.log(date)
  
//loads reservations
  useEffect(()=> {
    const abortController = new AbortController();
    setReservationsError(null)

    listReservations({date}, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError)
    
    return ()=> abortController.abort();
  }, [date])


  //loads tables
    useEffect(()=> {
      const abortController = new AbortController();

      setTablesError(null)
      listTables(abortController.signal)
          .then(setTables)
          .catch(setTablesError)
  
      return ()=> abortController.abort();
    }, [])
  

  //const history = useHistory();
 
  const reservationDate = formatReadableDate(date)
  
  return (
    <main>
      <h1>Dashboard</h1>
      <ErrorAlert error={reservationsError}/>
      <div className="d-md-flex mb-3">
        <div className="mb-3">
        <h4 className="mb-0">Reservations for {reservationDate}</h4>
          <DashboardDateNavigation date = {date}/>
          <ReservationsList reservations = {reservations}/> 
        </div>
       <ErrorAlert error = {tablesError}/> 
        <div className="mb-3 mx-3">
          <h4>Tables</h4>
            <TableList tables={tables}/> 
        </div>
        </div>
      {/* {JSON.stringify(reservations)}  */}
  </main>
  
  );
}

export default Dashboard;
