function SearchForm({
    phoneNumberSearching,
    searchTableGetter,
    setPhoneNumberSearching
}){
    
    function formChangeHandler({target}){
        const value=target.value
        console.log(value,"value from form")
        setPhoneNumberSearching(value)
    }
    return(
        <div className="container">
            <form onSubmit={searchTableGetter}>
                <div className="row">
                    <div className="col">
                        <label 
                            htmlFor="mobile_number"
                        >
                            Phone number to find
                        </label>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <input 
                            name="mobile_number"
                            id="mobile_number"
                            type="tel" 
                            placeholder="XXX-XXX-XXXX"
                            value={phoneNumberSearching}
                            onChange={formChangeHandler}
                            required
                            autofocus
                            />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <button 
                            type="submit" 
                            className="btn btn-success" 
                            >
                            Submit
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default SearchForm