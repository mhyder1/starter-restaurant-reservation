# Thinkful Capstone: Restaurant Reservation System

This application is a full-stack capstone project completed as part of Thinkful's full-stack web development program. The following prompt was provided for the assignment: 
> You have been hired as a full stack developer at _Periodic Tables_, a startup that is creating a reservation system for fine dining restaurants.
> The software is used only by restaurant personnel when a customer calls to request a reservation.
> At this point, the customers will not access the system online.

This application allows a restaurant to manage reservations, including creating, editing, seating, and cancelling reservations. It provides the ability to find any reservation (regardless of the reservation status) by inputting the phone number associated with the reservation. 

## Live application: 

A live version of this project can be viewed at ...
The project was created using the following technologies: 
- React
- HTML
- CSS
- JavaScript
- Express
- Knex
- PostgreSQL API

## Available API endpoints:

|     URL                               | Method  |   Function                                                  |
| ------------------------------------- | --------|-------------------------------------------------------------|
| `/reservations?date=YYYY-MM-DD`       |   GET   |Retrieves a list of reservations for the date requested      |
| `/reservations`                       |  POST   |Creates a new reservation                                    |
| `/reservations/reservation_id`        |  GET    |Retrieves a specific reservation based on the reservation_id |
| `/reservations/reservation_id`        |  PUT    |Allows user to edit a specific reservation                   |
| `/reservations/reservation_id/status` |  PUT    |Allows for a reservation status to be updated                |
|`/tables`                              |  GET    |Retrieves a list of tables at the restaurant                 |
|`/tables`                              | POST    |Creates a new table                                          |
|`/tables/table_id/seat`                | PUT     |Seats a reservation at a table                               |
|`/tables/table_id/seat`                | DELETE  |Finishes a reservation                                       |


## Application functionality:
### Dashboard
- This page will display a navigation bar, any active reservations for the current date, and the tables at the restaurant.
- The "Previous Day" and "Next Day" navigation buttons will take the user to the dashbaord view for those days. 
<img width="1141" alt="Screen Shot 2021-10-20 at 10 01 20 AM" src="https://user-images.githubusercontent.com/81823350/138119126-d71da44b-4961-4c69-98f8-0bf3a001e56d.png">

---

### Create a new reservation
- Here, the user can fill out a form to create a new reservation. 
- Submitting the form will take the user to the dashboard page for the date on which the reservation was booked. 
<img width="917" alt="Screen Shot 2021-10-20 at 8 36 32 AM" src="https://user-images.githubusercontent.com/81823350/138119502-6d4427a4-e83d-4e6b-8bf9-0e267b4f92ee.png">

---

### Edit a reservation
- The user can edit an existing reservation as long as the reservation status is "booked" and not already seated. 
- Saving the reservation will take the user back to the dashboard page on which the reservation is displayed.
<img width="1103" alt="Screen Shot 2021-10-20 at 8 37 36 AM" src="https://user-images.githubusercontent.com/81823350/138122006-88059aa3-ce34-4dc9-bfc0-b9ee7232d6ef.png">

---

### Create a new table
- Here, the user can create a new table by specifying the new table's name and available capacity
<img width="822" alt="Screen Shot 2021-10-20 at 8 44 08 AM" src="https://user-images.githubusercontent.com/81823350/138122178-0795ac52-ab41-4e49-8374-832dee4ec3b7.png">

---

### Search for a specific reservation
- The user may search for any reservation (whether active or not) by inputting the phone number associated with the reservation.
<img width="828" alt="Screen Shot 2021-10-20 at 8 43 38 AM" src="https://user-images.githubusercontent.com/81823350/138122496-896a750f-6977-432b-adec-b711b2231489.png">

---

### Seat a reservation
- To seat a reservation, the user can click on the "Seat" button which can be found on each unseated reservation on the Dashboard page. 
- The user will be asked to select a table from the drop-down list. 
- After clicking "Submit," the user will be returned to the Dashboard page. The reservation should now have a status of "seated." The table associated with the reservation will now have a status of "occupied" and will display a "Finish" button.

<img width="1105" alt="Screen Shot 2021-10-20 at 8 36 53 AM" src="https://user-images.githubusercontent.com/81823350/138124027-4c82d589-3fd2-4bce-b358-7f9192effa9b.png">

---

<img width="1108" alt="Screen Shot 2021-10-20 at 8 37 04 AM" src="https://user-images.githubusercontent.com/81823350/138123831-a73b1ca0-6fd0-455b-9b94-65755f6360f8.png">

---

<img width="1106" alt="Screen Shot 2021-10-20 at 8 37 19 AM" src="https://user-images.githubusercontent.com/81823350/138124159-c20c6fc9-147c-4652-890e-fad5eb7fef42.png">

---

### Finish a reservation
- When a reservation is completed (and the party vacates the table), the user can click the "Finish" button associated with the reservation. This will change the table status to "Free" and will remove the completed reservation from the dashboard. 
<img width="1054" alt="Screen Shot 2021-10-20 at 8 44 55 AM" src="https://user-images.githubusercontent.com/81823350/138125009-0f904649-1a93-4ca8-a699-6ef550cc9421.png">

---

<img width="1051" alt="Screen Shot 2021-10-20 at 8 45 03 AM" src="https://user-images.githubusercontent.com/81823350/138125070-487b969b-7e84-4483-b50c-176462871bd7.png">


### Cancel a reservation
-Clicking the cancel button on a reservation will result in a confirmation window that will prompt the user to confirm the cancellation. Once the reservation is cancelled, it will no longer be visible on the Dashboard.
<img width="1021" alt="Screen Shot 2021-10-20 at 8 45 15 AM" src="https://user-images.githubusercontent.com/81823350/138125487-b3915e64-9e0d-418d-9681-cd6b344c7e8b.png">

---

## Installation

1. Fork and clone this repository.
1. Run `cp ./back-end/.env.sample ./back-end/.env`.
1. Update the `./back-end/.env` file with the connection URL's to your ElephantSQL database instance.
1. Run `cp ./front-end/.env.sample ./front-end/.env`.
1. You should not need to make changes to the `./front-end/.env` file unless you want to connect to a backend at a location other than `http://localhost:5000`.
1. Run `npm install` to install project dependencies.
1. Run `npm run start:dev` to start your server in development mode.

If you have trouble getting the server to run, reach out for assistance.

