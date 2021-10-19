import React from "react"
import Table from "../tables/Table"

function TableList({tables}){
    let list = null;

    list = tables.map((table)=> (
        <div key={table.table_id}>
            <Table table = {table}/>
        </div>
        )
      )  
    
    return(
        <>
            {list}
        </>
    )
}

export default TableList;