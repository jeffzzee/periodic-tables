import React from "react"
import { useHistory, useParams } from "react-router-dom";
function SeatingFolk(props){
    // const {}=props //destructured props
    const history=useHistory()//for history manipulation
    const {reservation_id}=useParams() //for reservation to assign

    //begin JSX render
    return (
        <div> 

        </div>
    )
}
export default SeatingFolk