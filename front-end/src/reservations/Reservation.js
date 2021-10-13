import React from "react"
import {Link} from "react-router-dom"
import {formatAsTime} from "../utils/date-time"
import formatPhoneNumber from "../utils/format-phone-number.js"
// import {updateReservation} from "../utils/api"

function Reservation({reservation}){
  const{first_name, last_name, mobile_number, reservation_time, people, reservation_id, status} = reservation;
  console.log(reservation)
  const timeString = reservation_time.toString();
  const newTime =formatAsTime(timeString);
  const time = newTime.split(":");
  const hours = Number(time[0]);
  const minutes = Number(time[1]);
  let timeValue = null;
 const phoneNumber = formatPhoneNumber(mobile_number)


  if(hours > 0 && hours <=12){
      timeValue= "" + hours;
  } else if (hours >12){
      timeValue="" + (hours-12)
  } else if (hours===0){
      timeValue = "12"
  }
  timeValue += (minutes <10) ? ":0" + minutes : ":" + minutes;
  timeValue += (hours >=12) ? " P.M." : " A.M.";
 

  //need to figure out how to change status of a reservation when Seat clicked
    return(
        <div className = "card">
            <div className = "card-body">
                <h5 className="card-title">
                    Reservation for: {first_name} {last_name}
                </h5>
                <p className="card-text">Phone number: {phoneNumber}</p>
                <p className="card-text">Time: {timeValue}</p>
                <p className="card-text">Party size: {people}</p>
                <div data-reservation-id-status= {reservation_id}>{`Status: ${status}`}</div>
                {status==="booked" ? (
                    <Link to = {`/reservations/${reservation_id}/seat`}>
                        <button href ={`/reservations/${reservation_id}/seat`}
                                className="btn btn-primary">
                                    Seat
                        </button>
                    </Link>
                ) : 
                null}
            </div>
        </div>
    )
}

export default Reservation