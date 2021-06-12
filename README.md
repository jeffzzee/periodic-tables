## PERIODIC TABLES RESERVATION APP
- June 2021 Release Notes

## DEVELOPER
- Jeffrey Zeiss is a full stack Software Engineer in Fort Collins, Colorado.
- he is a Graduate of Thinkful's Full-Stack Engineering Immersion Program; Spring 2021.
- This was his Final Capstone Project showcasing many of the skills learned in the program. It is a true Full Stack Website.
- There are 5 main Technologies working in Unison Under the Hood:
  - Javascript
  - HTML
  - CSS
  - Libraries
    - Bootstrap
    - React
    - Express
    - Knex
  - PostgreSQL
- Below is a breakdown of the technologies and how they interface, including schematics for the API and methods

- See further BELOW for: INSTALLATION && TESTING && END NOTES
  - w/ a break down of how to Edit and Run this App Locally.

## UNDER THE HOOD
## ------------------------------------

## FRONT END
- Javascript
- HTML Skeleton
- CSS and Boot Strap

## RENDERING
- React Components, State Hooks

## BACK END
- Knex.js API Service
- Express.js Server 

## DATABASE
- PostgreSQL Database

## EXTRAS
- Alerts
- Error Handling
- Validators

## METHODS && BEHAVIORS && STRUCTURE
## -------------------------------------

## NAVIGATION AND APIs

Creating Reservations:
   - Reservations can be Created by clicking "New Reservation" in the menu Or by Navigating to `/reservations/new`
   - The Form provides the Required fields to make a Valid Reservation
   - Validators only accept Valid and Complete Reservations
   - Reservations Cannot be Made:
     - In the Past
     - Outside of Business Hours
     - Too Close to Closing Time
     - On Closure Days; in this Business's Case, Tuesdays
     - For Too Few Guests
     - Without Valid Credentials
   - Uses a POST method to `/reservations/` with a body of `{data: { status: <new-reservation> } }`
     - Initializes Reservations with a "Booked" Status

Creating Tables:
   - Tables can be Created by clicking "New Table" in the menu Or by Navigating to `/tables/new`
   - The Form provides the Required fields to make a Valid Table
   - Validators only accept Valid and Complete Tables
   - Tables Cannot be Made:
     - Without Available Seats
     - With a Name Shorter than 2 Characters
   - Uses a POST method to `/tables` with a body of `{data: { status: <new-table> } }`

Displaying Reservations:
   - The default view is for Today's date
     - Toggle the date view using the "next", "previous", and "today" buttons
   - The `/dashboard` page displays the dates' reservations; including: 
     - The status of the reservation. The default status is "booked"
     - The Reservation ID
     - The number of people in the group
     - The phone number of the reserved party
     - The date of the Reservation
     - The Time of the Reservation
     - Links to SEAT, EDIT or CANCEL if the reservation is booked
   - Uses a GET method to `/reservations/?date=XXXX-XX-XX`
     - Where XXXX-XX-XX is the Date in the URL and displayed on the Dashboard 
  
Displaying tables:
   - The Dashboard view shows a table display:
     - Includes table 
     - Indicates if a table is occupied
   - Uses a GET method to `/tables` 

Updating Status:
   - Uses a PUT to `/reservations/:reservation_id/status` with a body of `{data: { status: "<new-status>" } }` 
   - The new status, `<new-status>`, must be booked, seated, or finished

Seating a Reservation:
   - Reservations can be seated only when their reservation status is "booked"
   - Clicking the "Seat" button changes the status from "booked" to "seated"
   - Uses a PUT method to `/tables/:table_id/seat/` with a body of `{ data: { reservation_id: x } }`
     - `x` indicates the Reservation Id being seated
     - `table_id` in the Route indicates the table in the Database via API
   
Finishing Seated Reservations:
   - Clicking the Finish button associated with the table changes the reservation status to "finished" and removes the reservation from the dashboard.
   - Uses a DELETE method to `${API_BASE_URL}/tables/${table}/seat` 
   - Uses a PUT method to `/reservations/:reservation_id/status` toggle reservation status to finished

Searching Reservations:
   - To search for an existing reservation use the search page at `/search`
   - The search page will display all reservations matching the phone number, regardless of status.
   - The page will display `No reservations found` if there are no records found
   - Uses a GET method to `/reservations?mobile_phone=XXX-XXXX`
     - Where `XXX-XXXX` is the Phone Number Queried

Modifying or Cancelling a reservation:
   - You can cancel or update/edit an existing reservation from the `/dashboard` or `/search` page 
   - To cancel a reservation via API methods;
   - Uses a PUT method to `/reservations/:reservation_id/status` with a body of `{data: { status: "cancelled" } }`

Edit a Reservation:
   - Click Edit Reservation or go to the Page at `/reservations/:reservation_id/edit`. 
   - This will Display the Existing Reservation Data
   - Only Reservations with a Status of "booked" can be Edited.
   - After making Changes, clicking the "Submit" button to Save the Reservation
   - Uses a PUT method to `/reservations/:reservation_id` with a body of `{data: { status: <updated-reservation> } }`

## ------------------------------------


## Installation Testing && End Notes

## Original Assignment Premise:
> You have been hired as a full stack developer at _Periodic Tables_, a startup that is creating a reservation system for fine dining restaurants.
> The software is used only by restaurant personnel when a customer calls to request a reservation.
> At this point, the customers will not access the system online.


## Database setup

1. Set up four new ElephantSQL database instances - development, test, preview, and production -  


### Knex

Run `npx knex` commands from within the `back-end` folder, which is where the `knexfile.js` file is located.

## Installation

1. Fork and clone this repository.
1. Run `cp ./back-end/.env.sample ./back-end/.env`.
1. Update the `./back-end/.env` file with the connection URL's to your ElephantSQL database instance.
1. Run `cp ./front-end/.env.sample ./front-end/.env`.
1. You should not need to make changes to the `./front-end/.env` file unless you want to connect to a backend at a location other than `http://localhost:5000`.
1. Run `npm install` to install project dependencies.
1. Run `npm run start:dev` to start your server in development mode.

## Running tests

you can run all the tests using the following commands:

- `npm test` runs _all_ tests.
- `npm run test:backend` runs _all_ backend tests.
- `npm run test:frontend` runs _all_ frontend tests.
- `npm run test:e2e` runs only the end-to-end tests.