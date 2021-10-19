import React, {useState} from "react"
import {useHistory} from "react-router-dom"
import {finishTable} from "../utils/api"
import ErrorAlert from "../layout/ErrorAlert"

function Table({table}){
    const occupied = table.reservation_id
    const history = useHistory();

    const [finishError, setFinishError] = useState(null);

    const finishedHandler = ({target}) => {
        if(window.confirm("Is this table ready to seat new guests? This cannot be undone.")){
            const tableId = target.id
            const abortController = new AbortController()
        finishTable(tableId, abortController.signal)
            .then(()=> history.push('/'))
            .catch(setFinishError) 
            return ()=> abortController.abort();
        }
    }

    return (
        <>
        <ErrorAlert error = {finishError}/>
        <div className="card cards mb-2" >
            <div className="card-body">
                <h5 className="card-title">{table.table_name}</h5>
                    <div>
                        <h6>
                            <span data-table-id-status={`${table.table_id}`}>
                            Status: {occupied ? "Occupied" : "Free"}
                            </span>
                        </h6>
                        {table.reservation_id && (
                        <button
                            data-table-id-finish={table.table_id}
                            value={table.reservation_id}
                            id={table.table_id}
                            className="btn navBtn font-weight-bolder"
                            onClick={finishedHandler}>
                            Finish
                        </button>
                        )}
                    </div>
            </div>
        </div>
        </>
    )
}

export default Table;