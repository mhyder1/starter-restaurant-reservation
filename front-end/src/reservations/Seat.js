import React, {useState, useEffect}from "react";
import {useParams} from "react-router-dom"
import ErrorAlert from "../layout/ErrorAlert"
import Reservation from "./Reservation"
import { getReservation } from "../utils/api";

function Seat(){

//const [seatErrors, setSeatErrors] = useState(null)
const [reservation, setReservation] = useState({})
const [reservationError, setReservationError] = useState(null)
//const [tables, setTables] = useState({})
const {reservation_id} = useParams();

useEffect(loadReservation, [reservation_id])
//useEffect(loadTables, [])

function loadReservation(){
    const abortController = new AbortController();
    setReservationError(null)

    getReservation(reservation_id, abortController.signal)
        .then(setReservation)
        .catch(setReservationError)

    return ()=> abortController.abort();
}

    return (
        <>
        <ErrorAlert error = {reservationError}/>
        <Reservation reservation = {reservation}/>
        </>
    )
}

export default Seat;