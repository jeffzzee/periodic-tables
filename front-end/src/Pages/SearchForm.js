import React, { useEffect,useState } from "react"
import {listSpecReservations} from "../utils/api"
import {useParams,useHistory,Link} from "react-router-dom"
import ErrorAlert from "../layout/ErrorAlert"



function SearchForm({
    phoneNumberSearching,
    searchTableGetter,
    setPhoneNumberSearching}){
    
        function formChangeHandler({target}){
            const value=target.value
            console.log(value,"value from form")
            setPhoneNumberSearching(value)
        }
    return(
        <form onSubmit={searchTableGetter}>
            <label htmlFor="mobile_number">Phone number to find</label>
            <input 
            name="mobile_number"
            id="mobile_number"
            type="tel" 
            placeholder="XXX-XXX-XXXX"
            // pattern=
            value={phoneNumberSearching}
            onChange={formChangeHandler}
            required
            autofocus
            />
            <button type="submit" >Submit</button>
        </form>
    )
}

export default SearchForm