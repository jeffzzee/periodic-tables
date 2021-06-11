import React from 'react'
import { reservationStatusUpdate } from '../utils/api'

function ReservationDisplay(props) {
  const { reservations, reservationRefresh, setReservationRefresh } = props

  function cancelReservationHandler({ target }) {
    if (
      window.confirm(
        'Do you want to cancel this reservation? This cannot be undone.',
      )
    ) {
      const resID = target.getAttribute('data-reservation-id')
      const abortController = new AbortController()
      reservationStatusUpdate(
        resID,
        'cancelled',
        abortController.signal,
      )
        .then(() => setReservationRefresh(reservationRefresh + 1))
    }
  }

  function eachReservation() {
    return reservations.map((eachReservation) => {
      const {
        first_name,
        last_name,
        mobile_number,
        reservation_time,
        people,
        status,
      } = eachReservation
      return (
        <tr key={eachReservation.reservation_id}>
          <td>
            <strong>{eachReservation.reservation_id}</strong>
          </td>
          <td>{first_name}</td>
          <td>{last_name}</td>
          <td>{mobile_number}</td>
          <td>{reservation_time}</td>
          <td>{people}</td>
          <td data-reservation-id-status={eachReservation.reservation_id}>
            {status}
          </td>
          {status === 'booked' ? (
            <td>
              <a href={`/reservations/${eachReservation.reservation_id}/seat`}>
                <button type="button">Seat</button>
              </a>
            </td>
          ) : null}
          {status === 'booked' ? (
            <td>
              <a href={`/reservations/${eachReservation.reservation_id}/edit`}>
                <button type="button">Edit</button>
              </a>
            </td>
          ) : null}
          {status === 'booked' ? (
            <td>
              <button
                type="button"
                data-reservation-id={eachReservation.reservation_id}
                data-reservation-id-cancel={eachReservation.reservation_id}
                onClick={cancelReservationHandler}
              >
                Cancel
              </button>
            </td>
          ) : null}
        </tr>
      )
    })
  }

  if (!reservations) {
    return (
      <div>
        <h4>No Reservations for this date... Add reservations at </h4>
      </div>
    )
  }

  return (
    <div>
      <table>
        <caption>Reservations for this date...</caption>
        <thead>
          <tr>
            <th scope="col">First Name</th>
            <th scope="col">Last Name</th>
            <th scope="col">Phone</th>
            <th scope="col">Time</th>
            <th scope="col">People</th>
            <th scope="col">Status</th>
            <th scope="col">SEAT</th>
            <th scope="col">Edit</th>
            <th scope="col">Cancel</th>
          </tr>
        </thead>
        <tbody>{eachReservation()}</tbody>
      </table>
    </div>
  )
}
export default ReservationDisplay
