import React, {useState} from "react"

import { useHistory, useParams } from "react-router-dom";
import {updateTable} from "../utils/api"
import ErrorAlert from "../layout/ErrorAlert"
function SeatingFolk(props){
    const {tables,reservations,newTableAddState,setNewTableAddState}=props //destructured props
    const history=useHistory()//for history manipulation
    const  {reservation_id}=useParams() //for reservation to assign

    const originalSeat={reservation_id:reservation_id,table_id:'',reservation:null,tableCapacity:null}


    const [seatingState,setSeatingState]=useState(originalSeat) 
    const [errorCollector,setErrorCollector]=useState(null)
    // const {table_id,table_name,capacity}=tables //doesn't work because it is an array of objects (can only destructure from map or loop)
    let reservation=null

    function handleChange({target}){
        console.log(target.value,"target at handle change")
        console.log(tables,"tables")
        setSeatingState({...seatingState,table_id:target.value[0], tableCapacity:target.value[1]})
    }
    // const [thisReservation,setThisReservation]=useState(null)
    //find reservation details of this particular param?
    function findReservationDetails(){
        reservation=reservations.find((eachReservation)=>{
           return eachReservation.reservation_id===reservation_id
        })
        // const reservation=reservations[indexOfRes]

        // setThisReservation(reservation)

    }
    if(reservations){    
        findReservationDetails()
    }

    function formCheck(){
        const formErrorAcc=[]
        console.log("form check happening")
        if(!seatingState.table_id){
            formErrorAcc.push("please select a table")
        }
        
        if(reservation.people<seatingState.capacity){
            formErrorAcc.push("Table too small for a party so large")
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
        const signal=new AbortController().signal
        //add reservation on
        setSeatingState({...seatingState,reservation:reservation})
        //check form
        if(formCheck){
            console.log(seatingState,"seatingState")
        updateTable(seatingState,signal)
        // .then(()=>loadDashboard())
        .then(()=>setNewTableAddState(newTableAddState+1))
        .then(()=>history.push("/dashboard"))
        .catch(setErrorCollector)
        }
    }
    // function seatingFunction(){
    //     console.log("boop")
    // }

    // const allTables=()=>{
    //     tables.map((eachTable)=>{
    //     return(
                
    //                 <option 
    //                 name={eachTable.table_id}
    //                 value={{"table_id":eachTable.table_id, "capacity" :eachTable.capacity}}
    //                 // key={eachTable.table_id}
    //                 >
    //                 {eachTable.table_name} - {eachTable.capacity}
    //                 </option>
    //         )
    //     })

    // }

    //begin JSX render
    return (
        <div> 
            <ErrorAlert error={errorCollector}/>
            <form onSubmit={seatingFunction}>
                <label htmlFor="table_id">Table Assignment</label>
                    <select name="table_id" id="table_id" 
                // value={{table_id:seatingState.table_id,capacity:seatingState.capacity}}
                     onChange={handleChange}>
                        {        tables.map((eachTable)=>{
        return(
                
                    <option 
                    name={eachTable.table_id}
                    value={[eachTable.table_id,eachTable.capacity]}
                    // {
                        // {"table_id":eachTable.table_id, "capacity" :eachTable.capacity}
                    // }
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