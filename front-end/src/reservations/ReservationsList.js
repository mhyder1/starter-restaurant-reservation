import NotFound from "../layout/NotFound"
import Reservation from "./Reservation"
import ErrorAlert from "../layout/ErrorAlert"
function ReservationsList({reservations}){

const filteredReservations = reservations.filter((reservation)=> 
     reservation.status==="booked" || reservation.status==="seated")

     if(filteredReservations.length===0){
        return <NotFound/>}

const resList = filteredReservations.map((res)=> 
    <li key = {res.reservation_id}>
        <Reservation 
            key = {res.reservation_id}
            reservation= {res}
            reservationId = {res.reservation_id}
        />
    </li>)

return (
    <>
    <ErrorAlert/>
    
    <ul className="list-unstyled">
     {resList}
    </ul>
    </>
)
}


export default ReservationsList