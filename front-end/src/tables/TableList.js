import React from "react"
import Table from "../tables/Table"

function TableList({tables}){
    let list = null;

    if(tables.length){
      list = tables.map((table, index)=> {
        return (
        <div key={index}>
            <Table table = {table}/>
        </div>
        )
      })  
    }
    
 return(
     <>
     {list}
     </>
 )
}

export default TableList;