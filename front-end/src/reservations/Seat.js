import React, {useState, useEffect}from "react";
import {useParams, useHistory} from "react-router-dom"
import ErrorAlert from "../layout/ErrorAlert"
//import Reservation from "./Reservation"
import { listTables, readReservation, seatTable } from "../utils/api";

function Seat(){
    const history = useHistory()
    
    const [seatTableError, setSeatTableError] = useState(null)
    const [tablesError, setTablesError] = useState(null)
    const [reservationError, setReservationError]= useState(null)
    const [tableId, setTableId] = useState("")
    const [reservation, setReservation] = useState([])
    const [tables, setTables] = useState([])
    const {reservation_id} = useParams();
    

 useEffect(()=> {
    const abortController = new AbortController();
         setTablesError(null)
         listTables(abortController.signal)
             .then(setTables)
             .catch(setTablesError)
         return()=> abortController.abort();
     }, [])


  useEffect(()=> {
      const abortController= new AbortController();
      setReservationError(null)
      readReservation(reservation_id, abortController.signal)
              .then(setReservation)
              .catch(setReservationError)
     return()=> abortController.abort();
  }, [reservation_id])



const handleChange = ({target}) => {
    setTableId(target.value)
    console.log(target.value)
    };


 const handleSubmit = (event)=> {
     event.preventDefault();
     const abortController= new AbortController();
     setSeatTableError(null)

     seatTable(reservation_id, tableId.table_id, abortController.signal)
        .then(()=> history.push('/dashboard'))
        .catch(setSeatTableError)

    return ()=> abortController.abort()
 }

    return (
        <>
        <ErrorAlert error = {reservationError}/>
        <ErrorAlert error= {tablesError}/>
        <ErrorAlert error = {seatTableError}/>
        <h2>Assign table for party of {reservation.people}</h2>
            <form onSubmit={handleSubmit}>
                <div className = "container">
                    <div className= "form-group">
                        <label htmlFor="table_id"> Choose a Table</label>
                            <select
                                className = "form-control"
                                name="table_id"
                                id="table_id"
                                value = {tableId}
                                onChange = {handleChange}
                            >
                                <option value = "" >--Select an Option--</option>
                                {tables.map((table, index)=> {
                                    return (<option key={index} value={table.table_id}>{table.table_name}-{table.capacity}</option>)
                                })}
                            </select>
                            <button type="submit" className="btn btn-primary">Submit</button>
                            <button type="button" className="btn btn-secondary" onClick={()=> history.goBack()}>Cancel</button>
                    </div>
                </div>
            </form>
        </>
    )
}

export default Seat;


