import NotFound from "../layout/NotFound"
import Reservation from "./Reservation"
import ErrorAlert from "../layout/ErrorAlert"
function ReservationsList({reservations}){

if(reservations.length===0){
    return <NotFound/>}

// const filteredReservations = reservations.filter((reservation)=> 
//     reservation.status==="booked" || reservation.status==="seated")

const resList = reservations.map((res)=> 
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