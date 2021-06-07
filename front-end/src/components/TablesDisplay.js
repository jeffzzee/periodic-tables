import React from "react"
import{Link}from "react-router-dom"
import {deleteTableResIdDetail} from "../utils/api"

function TablesDisplay(props){
    const {tables,setNewTableAddState,newTableAddState}=props

    function finishClick(event){
        console.log("finish clicked")

            event.preventDefault();//probably not necessary if not a submit button
            let ID = event.target.getAttribute("data-table-id-finish")

            if (window.confirm("Is this table ready to seat new guests? This cannot be undone")) {
                deleteTableResIdDetail(ID)
                    .then((x) => { setNewTableAddState(newTableAddState + 1) })
            }

        }
    

    function eachTable(){
        return tables.map((eachTable)=>{
            const{table_id,table_name,capacity}=eachTable
            return (<tr key={eachTable.table_id}>
            <td><strong>{table_id}</strong></td>
            <td>{table_name}</td>
            <td>{capacity}</td>
            <td data-table-id-status={table_id}>{eachTable.reservation_id?"Occupied":"Free"}</td>
            <td>{!eachTable.reservation_id?null:<button type="button" data-table-id-finish={eachTable.table_id} onClick={finishClick()}>Finish</button>}</td>
            {/* <td>{people}</td> */}
            {/* <td>{status}</td> */}
            {/* <td><Link to={`/reservations/${eachReservation.reservation_id}/seat`}><button type="button">Seat</button></Link></td> */}
            {/* <td></td> */}
        </tr>)
        })
    }
    

if(!tables){
    return (<div>
        <h4>No tables to assign...</h4>
        <Link to={`/tables/new`}><button type="button">Add Tables</button></Link>
    </div>)}

    return (
    <div>
            <table>
                <caption>Restaurant Table Seating Available</caption>
                <thead>
                    <tr>
                    <th scope="col">Table ID</th>
                    <th scope="col">Table Name</th>
                    <th scope="col">Capacity</th>
                    <th scope="col">Status</th>
                    <th scope="col">Finish</th>
                    </tr>
                </thead>
                <tbody>
                    {eachTable()}
                </tbody>
                </table>
               </div>
               ) 
}
export default TablesDisplay