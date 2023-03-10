import React, {useState} from "react"
import {Link, useHistory} from "react-router-dom"
import {getTimeFormat} from "../utils/date-time"
import formatPhoneNumber from "../utils/format-phone-number.js"
import {updateReservationStatus} from "../utils/api"
import ErrorAlert from "../layout/ErrorAlert"

function Reservation({reservation}){
  const{first_name, last_name, mobile_number, reservation_time, people, reservation_id, status} = reservation;
  
  const [cancelError, setCancelError] = useState(null);
  const history = useHistory();
  const formattedTime = getTimeFormat(reservation_time);
  
  const phoneNumber = formatPhoneNumber(mobile_number)

  const handleCancel = (event) => {
      event.preventDefault();
      if(window.confirm("Do you want to cancel this reservation? This cannot be undone.")){
          const abortController = new AbortController();
          setCancelError(null);
          
          updateReservationStatus(reservation_id, "cancelled", abortController.signal)
            .then(()=> history.go(0))
            .catch(setCancelError)

          return()=> abortController.abort();   
        }
  }

    return(
        <div className = "card cards mb-4">
            <div className = "card-body">
                <h5 className="card-title">
                    Reservation for: {first_name} {last_name}
                </h5>
                    <p className="card-text">Phone number: {phoneNumber}</p>
                    <p className="card-text">Time: {formattedTime}</p>
                    <p className="card-text">Party size: {people}</p>
                    <div data-reservation-id-status= {reservation_id}>{`Status: ${status}`}</div>
                    {status==="booked" ? (
                        <Link to = {`/reservations/${reservation_id}/seat`} className="btn btn-dark font-weight-bolder mr-2">
                            Seat
                        </Link>
                        ) : null}

                        <Link to={`/reservations/${reservation_id}/edit`}>
                            <button href = {`/reservations/${reservation_id}/edit`}
                                className="btn editBtn text-dark font-weight-bolder mr-2">
                                    Edit
                            </button>
                        </Link>
                        
                        <button 
                            data-reservation-id-cancel={reservation.reservation_id} 
                            className="btn cancelBtn text-white font-weight-bolder"
                            onClick = {handleCancel}>
                            Cancel
                        </button>
                    <ErrorAlert error = {cancelError}/> 
            </div>
        </div>
    )
}

export default Reservation