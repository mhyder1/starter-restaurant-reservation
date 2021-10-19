import React, {useState} from "react";
import {useHistory} from "react-router-dom"
import {postTable} from "../utils/api"
import ErrorAlert from "../layout/ErrorAlert";

function NewTable(){
    const initialFormState = {
        table_name: "",
        capacity: 1,
    }

    const [tableForm, setTableForm] = useState({...initialFormState})
    const [tableFormErrors, setTableFormErrors] = useState(null)
    const history = useHistory();

    const handleSubmit = (event) => {
        event.preventDefault();
        const abortController = new AbortController();

         postTable(tableForm, abortController.signal)
            .then(()=> history.push("/dashboard"))
            .catch(setTableFormErrors)
        
        return ()=> abortController.abort()
    }

    const handleChange = ({target}) => {
        let value = target.value
        let name = target.name

        if(name === "capacity" && typeof value==="string"){
            value = +value
        }
        setTableForm({
            ...tableForm,
            [name]: value,
        })
    }

    return (
        <div>
            <h2 className="heading my-2 p-2">New Table</h2>
            {/* <div class="group">
				<div class="item"></div> */}
            <form onSubmit={handleSubmit}>
                <ErrorAlert error={tableFormErrors}/>
                
                    <div className="form-group formInput">
                        <label htmlFor="table_name">Table Name:</label>
                            <input 
                               className="form-control"
                               type="text"
                               id="table_name"
                               name="table_name"
                               placeholder="Enter table name"
                               required = {true}
                               onChange = {handleChange} 
                            />
                    </div>
                
                    <div className = "form-group">
                        <label htmlFor="capacity">Capacity:</label>
                            <input
                                className="form-control"
                                type = "number"
                                name= "capacity"
                                id="capacity"
                                placeholder = "Enter capacity here"
                                required = {true}
                                onChange = {handleChange}
                            />
                    </div>
                    <span className="formBtn">
                    <button type="submit" className="btn btn-primary">Submit</button>
                    <button type="button" className="btn btn-secondary mx-3" onClick={()=> history.goBack()}>Cancel</button>
                    </span>
        </form>
            </div>
        // </div>
    )
}

export default NewTable;