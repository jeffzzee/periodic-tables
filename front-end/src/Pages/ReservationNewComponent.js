import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import {
        createReservation,
        readReservation,
        updateReservation,
} from '../utils/api'
import { today } from '../utils/date-time'
import ErrorAlert from '../layout/ErrorAlert'

function ReservationNewComponent({
        editState,
        setEditState,
        reservationRefresh,
        setReservationRefresh,
}) {
  const blankForm = {
          first_name: '',
          last_name: '',
          mobile_number: '',
          reservation_date: '',
          reservation_time: '',
          people: 0,
  }
        const [errorCollector, setErrorCollector] = useState(null) //for front end validation
        const [formState, setFormState] = useState(blankForm)
        const todayDateObject = today() //defaults to today (used in 2 helper functions )
        const history = useHistory() //for links
        //initialized empty form

  useEffect(grabEditRes, [editState])
  function grabEditRes() {
    if (editState) {
      setErrorCollector(null)
      const signal = new AbortController().signal
      return (
        readReservation(editState, signal)
          .then((x) => {
            const d = new Date(x.reservation_date)
            const month = d.getMonth() + 1
            const day = d.getDate()
            const year = d.getFullYear()
            const dateString =
              year +
              '-' +
              (month < 10 ? '0' + month : month) +
              '-' +
              (day < 10 ? '0' + day : day)
            setFormState({ ...x, reservation_date: dateString })
          })
      )
    }
  }


  function dateCheck() {
    const dateErrors = [] //error holder
    const dateObject = new Date(formState.reservation_date) //creates a Date object from argument
    if (dateObject.getDay() === 1) {
      dateErrors.push(
        'Reservations cannot be made on Tuesday; the restaurant is closed on Tuesday',
      )
    }
    if (dateObject < todayDateObject) {
      dateErrors.push(
        'Reservations must be made on a future date and cannot be made in the past',
      )
    }
    if (dateErrors.length === 0) {
      //if error state has NO content return true
      return true
    } else {
      setErrorCollector(new Error(dateErrors.toString()))
      return false //otherwise return false
    }
  }

  function timeCheck() {
    const timeErrors = []
    console.log(todayDateObject, 'the today object from today()')
    const reserveDateTime = new Date(
      `${formState.reservation_date}T${formState.reservation_time}:00.000`,
    ) //extends the date/time continuum for comparison of past
    if (reserveDateTime < todayDateObject) {
      timeErrors.push(
        'reservation must be made on a future date and cannot be made in the past',
      )
    }
    if (reserveDateTime.getHours < 11 && reserveDateTime.getMinutes() < 30)
      timeErrors.push(
        'Reservation cannot be made before we are open. We are closed until 10:30AM',
      )
    if (
      reserveDateTime.getHours() === 21 &&
      reserveDateTime.getMinutes() > 30
    ) {
      timeErrors.push(
        'Reservations must be made an hour before close at 10:30PM',
      )
    }
    if (timeErrors.length === 0) {
      return true
    } else {
      setErrorCollector(...errorCollector, new Error(timeErrors.toString()))
      return false
    }
  }


  function handleSubmit(event) {
    event.preventDefault() //submission default prevention
    setErrorCollector(null)
    const signal = new AbortController().signal //create an abort controller instance signal
    //if no errors then true
    if (dateCheck()) {
      //if no errors then true
      if (timeCheck()) {
        //API post
        createReservation(formState, signal) //actual API call via imported Util
          .then(() => setReservationRefresh(reservationRefresh + 1))
          .then(() =>
            history.push(`/dashboard?date=${formState.reservation_date}`),
          ) //send user to reservation date URL)
          .catch(setErrorCollector)
      }
    }
  }
  function handleUpdate(event) {
    event.preventDefault() //submission default prevention
    setErrorCollector(null)
    console.log('sending an update to api')
    console.log('the edit state', editState)
    console.log('the formState before API send', formState)
    const signal = new AbortController().signal //create an abort controller instance signal
    //check form's date submission locally on front end first
    //if no errors then true
    if (dateCheck()) {
      //if no errors then true
      if (timeCheck()) {
        //API post
        updateReservation(editState, formState, signal) //actual API call via imported Util
          .then(() => setReservationRefresh(reservationRefresh + 1))
          .then((x) => setEditState(null))
          .then(() =>
            history.push(`/dashboard?date=${formState.reservation_date}`),
          ) //send user to reservation date URL)
          .catch(setErrorCollector)
      }
    }
  }

  function cancelClick(event) {
    history.goBack()
  }

  function changeHandler({ target }) {
    let value = target.value
    if (target.name === 'people') {
      value = Number(target.value)
      console.log(target.value)
    }
    setFormState({ ...formState, [target.name]: value })
  }
  return (
    <div>
      <div className="container">
        <h2>Reservation Form</h2>
        <ErrorAlert error={errorCollector} />
        <form onSubmit={editState ? handleUpdate : handleSubmit}>
          <div className="row">
            <div className="col-25">
              <label htmlFor="first_name">First Name:</label>
            </div>
            <div className="col-75">
              <input
                name="first_name"
                id="first_name"
                type="text"
                // defaultValue=
                onChange={changeHandler}
                value={formState.first_name}
                placeholder="First Name"
                required
              />
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-25">
              <label htmlFor="last_name">Last Name:</label>
            </div>
            <div className="col-75">
              <input
                name="last_name"
                id="last_name"
                type="text"
                onChange={changeHandler}
                value={formState.last_name}
                placeholder="Last Name"
                required
              />
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-25">
              <label htmlFor="mobile_number">Phone:</label>
            </div>
            <div className="col-75">
              <input
                name="mobile_number"
                id="mobile_number"
                type="tel"
                onChange={changeHandler}
                value={formState.mobile_number}
                placeholder="XXX-XXX-XXXX"
                required
              />
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-25">
              <label>Reservation Date:</label>
            </div>
            <div className="col-75">
              <input
                name="reservation_date"
                id="reservation_date"
                type="date"
                onChange={changeHandler}
                value={formState.reservation_date}
                placeholder="Date"
                required
              />
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-25">
              <label>Reservation Time:</label>
            </div>
            <div className="col-75">
              <input
                name="reservation_time"
                id="reservation_time"
                type="time"
                onChange={changeHandler}
                value={formState.reservation_time}
                required
              />
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-25">
              <label>Number of People:</label>
            </div>
            <div className="col-75">
              <input
                name="people"
                id="people"
                type="number"
                min="1"
                step="1"
                onChange={changeHandler}
                value={formState.people}
                placeholder="Party Number"
                required
              />
            </div>
          </div>
          <br />
          <button type="button" className="btn btn-danger" onClick={cancelClick}>
            cancel
          </button>
          <button type="submit" className="btn btn-success" value="Submit">
            Submit
          </button>
        </form>
      </div>
    </div>

  )
}
export default ReservationNewComponent
