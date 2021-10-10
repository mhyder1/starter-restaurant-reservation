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
    const [tableFormErrors, setTableFormErrors] = useState([])
    const history = useHistory();

    const handleSubmit = (event) => {
        event.preventDefault();
        const abortController = new AbortController();

        async function createTable(){
            try{
                await postTable(tableForm, abortController.signal);
                history.push("/dashboard")
            }
            catch(error){
                setTableFormErrors([...tableFormErrors, error.message])
            }
        }
        if(tableFormErrors.length===0){
            createTable();
        }
    }

    const handleChange = ({target}) => {
        let value = target.value
        let name = target.name

        setTableForm({
            ...tableForm,
            [value]: name,
        })
    }

    return (
        <div>
            <h1>New Table</h1>
            <form onSubmit={handleSubmit}>
                <ErrorAlert error={tableFormErrors}/>
                <div className="container">
                    <div className="form-group">
                        <label htmlFor="table_name">Table Name</label>
                            <input 
                               type="text"
                               id="table_name"
                               name="table_name"
                               placeholder="Table name"
                               required = {true}
                               onChange = {handleChange} 
                            />
                    </div>
                
                    <div className = "form-group">
                        <label htmlFor="capacity">Capacity</label>
                            <input
                                type = "number"
                                name= "capacity"
                                id="capacity"
                                placeholder = "Enter capacity here"
                                required = {true}
                                onChange = {handleChange}
                            />
                    </div>
                </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                    <button type="button" className="btn btn-secondary" onClick={()=> history.goBack()}>Cancel</button>
            </form>
        </div>
    )
}

export default NewTable;