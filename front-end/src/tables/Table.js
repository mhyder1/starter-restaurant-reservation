import React from "react"

function Table({table}){

    const occupied = table.reservation_id
return (
    <div className="card">
        <div className="card-body">
            <h5 className="card-title">Table Name</h5>
            <div>
                <h6>
                    <span data-table-id-status={`${table.table_id}`}>
                        {occupied ? "Occupied" : "Free"}
                    </span>
                </h6>
            </div>
        </div>
    </div>
)


}

export default Table;