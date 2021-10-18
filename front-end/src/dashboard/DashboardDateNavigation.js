import React from "react"
import {Link} from "react-router-dom";
import {today, previous, next} from "../utils/date-time"

function DashboardDateNavigation({date}){
    return (
    <div className="dateNav p-3">
        <Link to={`/dashboard?date=${previous(date)}`}>
            <button className="btn btn-secondary text-white mx-1">
                Previous Day
            </button>

        </Link>

        <Link to={`/dashboard?date=${today()}`}>
            <button className="btn text-white navBtn mx-1">
                 Today
            </button>
        </Link>

        <Link to={`/dashboard?date=${next(date)}`}>
            <button className="btn btn-secondary text-white mx-1">
                Next Day
            </button>
        </Link>
    </div>
    )
}

export default DashboardDateNavigation;