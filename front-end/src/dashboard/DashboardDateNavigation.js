import React from "react"
import {Link} from "react-router-dom";
import {today, previous, next} from "../utils/date-time"

function DashboardDateNavigation({date}){
    return (
    <div className="dateNav mb-4">
        <Link to={`/dashboard?date=${previous(date)}`}>
            <button className="btn prevNext mx-1">
                Previous Day
            </button>

        </Link>

        <Link to={`/dashboard?date=${today()}`}>
            <button className="btn navBtn font-weight-bolder mx-1">
                 Today
            </button>
        </Link>

        <Link to={`/dashboard?date=${next(date)}`}>
            <button className="btn prevNext mx-1">
                Next Day
            </button>
        </Link>
    </div>
    )
}

export default DashboardDateNavigation;