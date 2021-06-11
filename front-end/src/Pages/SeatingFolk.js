import React, { useState } from "react"

import { useHistory, useParams } from "react-router-dom";
import { updateTable } from "../utils/api"

import ErrorAlert from "../layout/ErrorAlert"

function SeatingFolk(props){
    const {
        newTableAddState,
        setNewTableAddState,
        tables, 
        reservationRefresh,
        setReservationRefresh
    }=props //destructured props
    const [errorCollector,setErrorCollector]=useState(null)
    const [tableID,setTableID]=useState("Select a table")
    const history=useHistory()//for history manipulation
    const  {reservation_id}=useParams() //for reservation to assign

    function handleChange({target}){
        setTableID(target.value)
    }
    
    function formCheck(){
        const formErrorAcc=[]
        if (tableID==="Select a table"){
            formErrorAcc.push("Please select a table")
        }

        if(formErrorAcc.length===0){
            return true
        }else{
            setErrorCollector(new Error(formErrorAcc.toString()))
            return false
        }
    }
    // handle submit
    function seatingFunction(event){
        event.preventDefault()
        setErrorCollector(null)
        const signal=new AbortController().signal
        //check form
        if(formCheck()){
            updateTable(tableID,reservation_id,signal)
                .then(()=>setNewTableAddState(newTableAddState+1))
                .then((x)=>setTableID("Select a table"))
                .then((x)=>setReservationRefresh(reservationRefresh+1))
                .then(()=>history.push("/dashboard"))
                .catch(setErrorCollector)
        }
    }

    if(!tables){
        return <div>
            <p>Please supply some tables</p>
        </div>
    }
    
    return (
        <div> 
            <ErrorAlert error={errorCollector}/>
            <form onSubmit={seatingFunction}>
                <label htmlFor="table_id">Table Assignment</label>
                    <select name="table_id" id="table_id" 
                    value={tableID}
                    defaultValue={tableID}
                     onChange={handleChange}
                     placeholder="select"
                     >
                         <option 
                         default
                         name="def"
                     value="Select a table"
                     >Select a table</option>
                        {        tables.map((eachTable)=>{
        return(
                
                    <option 
                    name={eachTable.table_id}
                    value={eachTable.table_id}
                    key={eachTable.table_id}
                    >
                    {eachTable.table_name} - {eachTable.capacity}
                    </option>
            )
        })
}
                    </select>
                    <button type="submit" >Submit</button>
                    <button type="button" onClick={history.goBack}>Cancel</button>
            </form>
        </div>
    )
}
export default SeatingFolk