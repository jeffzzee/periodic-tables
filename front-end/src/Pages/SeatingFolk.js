import React, {useEffect, useState} from "react"

import { useHistory, useParams } from "react-router-dom";
import {updateTable,listTables,readReservation} from "../utils/api"

import ErrorAlert from "../layout/ErrorAlert"

function SeatingFolk(props){
    const {newTableAddState,setNewTableAddState,tables, reservationRefresh,
    setReservationRefresh
        // reservations
    }=props //destructured props
    const history=useHistory()//for history manipulation
    const  {reservation_id}=useParams() //for reservation to assign
    
    const [errorCollector,setErrorCollector]=useState(null)
    const [tableID,setTableID]=useState("Select a table")
    // const [seatingState,setSeatingState]=useState(null) 
    
    
    // let originalSeat={reservation_id:reservation_id,}
    // setSeatingState(originalSeat)

    // const [apiTables,setApiTables]=useState('')
    // const [errorsTable,setErrorsTable]=useState('')
    // const [reservationList,setReservationList]=useState('')
    // const [reservation,setReservation]=useState('')
    // const [reservationErrors,setReservationErrors]=useState('')


    // const {table_id,table_name,capacity}=tables //doesn't work because it is an array of objects (can only destructure from map or loop)


    // console.log(tables[0],"tables")

    function handleChange({target}){
        // console.log(target.value,"target at handle change")
        // // console.log(tables,"tables")
        setTableID(target.value)

    }
    // const [thisReservation,setThisReservation]=useState(null)
    //find reservation details of this particular param?
    // function findReservationDetails(){
    //     reservation=reservations.find((eachReservation)=>{
    //        return eachReservation.reservation_id===reservation_id
    //     })
        // const reservation=reservations[indexOfRes]

        // setThisReservation(reservation)

    
    // useEffect(()=>{ 
    //     findReservationDetails()
    // },[])
    // useEffect(() => {
    //     const abortController = new AbortController();
    //     setErrorsTable(null);
    //     listTables(abortController.signal)
    //       .then(setApiTables)
    //       .catch(setErrorsTable);
    //     return () => abortController.abort();
    //   }, []);
    //   useEffect(() => {
    //     const abortController = new AbortController();
    //     setReservationErrors(null);
    //     readReservation(reservation_id, abortController.signal)
    //       .then(setReservation)
    //       .catch(setReservationErrors);
    //     return () => abortController.abort();
    //   }, [reservation_id])

    function formCheck(){
        const formErrorAcc=[]
        if (tableID==="Select a table"){
            formErrorAcc.push("Please select a table")
        }
    //     console.log("form check happening")
    //     if(!tableID){
    //         formErrorAcc.push("please select a table")
    //     }
        
    //     // if(reservation.people<seatingState.capacity){
    //     //     formErrorAcc.push("Table too small for a party so large")
    //     // // }
    //     // if(!seatingState.table_id){
    //     //     formErrorAcc.push("need a table selection")
    //     // }
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
        //add reservation on
        
        //check form
        if(formCheck()){
            // console.log(seatingState,"seatingState")
            // if(!tableID){
            //     setTableID(tables[0].table_id)
            // }
        updateTable(tableID,reservation_id,signal)
        // .then(()=>loadDashboard())
        .then(()=>setNewTableAddState(newTableAddState+1))
        .then((x)=>setTableID("Select a table"))
        .then((x)=>setReservationRefresh(reservationRefresh+1))
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
    if(!tables){
        return <div>
            <p>Please supply some tables</p>
        </div>
    }
    
    return (
        <div> 
            {/* <ErrorAlert error={errorsTable}/> */}
            <ErrorAlert error={errorCollector}/>
            <form onSubmit={seatingFunction}>
                <label htmlFor="table_id">Table Assignment</label>
                    <select name="table_id" id="table_id" 
                    value={tableID}//state holder
                    defaultValue={tableID}
                     onChange={handleChange}
                     placeHolder="select"
                     >
                         <option 
                         default
                         name="def"
                     value="Select a table"
                     >Select a table</option>
                        {        tables.map((eachTable)=>{
        return(
                
                    <option 
                    name={eachTable.table_id}//table within list of tables
                    value={eachTable.table_id}
                    // data-capacity={eachTable.capacity}
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