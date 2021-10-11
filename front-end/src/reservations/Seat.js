import React, {useState, useEffect}from "react";
import {useParams} from "react-router-dom"
import ErrorAlert from "../layout/ErrorAlert"
import Reservation from "./Reservation"
import { listTables, readReservation } from "../utils/api";

function Seat(){

    const initialFormState = {
        table_id: "",
    };

    const [error, setError] = useState(null)
    const [formData, setFormData] = useState({...initialFormState})
    const [reservation, setReservation] = useState({})
    const [tables, setTables] = useState({})
    const {reservation_id} = useParams();

 useEffect(()=> {
    async function loadTables(){
         const abortController = new AbortController();
         setError(null)
         readReservation(reservation_id, abortController.signal)
             .then(setReservation)
             .catch(setError)
         listTables(abortController.signal)
             .then(setTables)
             .catch(setError)
         return()=> abortController.abort();
     }
     loadTables()
 }, [reservation_id])

    return (
        <>
        <ErrorAlert error = {error}/>
        <Reservation reservation = {reservation}/>
        </>
    )
}

export default Seat;