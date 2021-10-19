
   
import React, {useEffect, useState} from "react";
import { useHistory, useParams} from "react-router-dom"
import {postReservation, readReservation, updateReservation} from "../utils/api"
import {formatAsTime} from "../utils/date-time"
import ErrorAlert from "../layout/ErrorAlert";

function ReservationForm(){
    const {reservation_id} = useParams()
    const initialFormState= {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: 1,
    }

    const [form, setForm] = useState({...initialFormState})
    const [reservationsError, setReservationsError] = useState(null);
    const history= useHistory();

  
    useEffect(()=> {
        const abortController = new AbortController();
        if(reservation_id){
            readReservation(reservation_id, abortController.signal)
                .then(setForm)
                .catch(setReservationsError)
        }
        return () => abortController.abort()
    }, [reservation_id])


    const handleChange = ({target}) => {
        let value = target.value;
        let name =target.name;

        if(name==="people" && typeof value === "string"){
            value = +value
        }

        if(name==="reservation_time"){
            value = formatAsTime(value)
        }
        setForm({
            ...form, 
            [name]: value,
        })
    }
    

    const handleSubmit = (event) => {
        event.preventDefault();
        const abortController = new AbortController();
        if(!reservation_id){
        setReservationsError(null);
        postReservation(form, abortController.signal)
            .then(()=> history.push(`/dashboard?date=${form.reservation_date}`))
            .catch(setReservationsError)
        }

        if(reservation_id){
            setReservationsError(null);
            updateReservation(form, abortController.signal)
                .then(()=> history.goBack())
                .catch(setReservationsError)
        }
        return () => abortController.abort();
    }

    console.log(form)
      
    return (
        <>
        {reservation_id ? <h2>Edit Reservation</h2> : <h2>Make a Reservation</h2> }
        <form onSubmit = {handleSubmit}>
            <ErrorAlert error = {reservationsError}/>
            <div className="container">
            <div className="form-group formDivCreate">
                <label htmlFor="first_name">
                    First Name:
                    <input 
                        className="form-control"
                        type="text" 
                        id="first_name" 
                        name="first_name"
                        placeholder="First Name"
                        onChange = {handleChange}
                        required = {true}
                        value = {form.first_name}
                    />
                </label>
            </div>
            
            <div className="form-group formDivCreate">
                <label htmlFor="last_name">
                    Last Name:
                    <input 
                        className="form-control"
                        type="text" 
                        id="last_name" 
                        name="last_name"
                        placeholder= "Last Name"
                        onChange = {handleChange}
                        required = {true}
                        value = {form.last_name}
                    />
                </label>
            </div>

            <div className="form-group formDivCreate">
                <label htmlFor="mobile_number">
                    Phone number: 
                    <input 
                        className="form-control"
                        type="tel" 
                        id="telNo" 
                        name="mobile_number" 
                        placeholder="1234567890"
                        onChange = {handleChange}
                        required = {true}
                        value = {form.mobile_number}
                    />
                </label>
            </div>

            <div className="form-group formDivCreate">
                <label htmlFor="reservation_date">
                    Reservation Date: 
                    <input 
                        className="form-control"
                        type="date" 
                        id="reservation_date" 
                        name="reservation_date"
                        onChange= {handleChange}
                        required = {true}
                        value = {form.reservation_date}
                    />
                </label>
            </div>

            <div className="form-group formDivCreate">
                <label htmlFor="reservation_time">
                    Reservation Time: 
                    <input 
                        className="form-control"
                        type="time" 
                        id="reservation_time" 
                        name="reservation_time"
                        onChange = {handleChange}
                        required = {true}
                        value = {form.reservation_time} 
                    />
                </label>
            </div>

            <div className="form-group formDivCreate">
                <label htmlFor="people">
                    Number of People in Party: 
                    <input
                        className="form-control" 
                        type="number" 
                        id="people" 
                        name="people"
                        min="1" 
                        required = {true}
                        onChange= {handleChange}
                        value= {form.people}
                    />
                </label>
            </div>
            </div>
            <button type="submit" className="btn btn-primary mx-2" >Submit</button>
            <button type="button" className="btn btn-secondary mx-2" onClick={()=> history.goBack()}>Cancel</button>
            
 
        </form>
        </>
    )
 /*
 any error messages returned from API
*/
}


export default ReservationForm;
