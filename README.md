# Interview Scheduler

An app that allows a user to schedule an appointment on the day of their choice, assuming there is an available time slot. It was built with React, Axios, WebSockets, Storybook, Jest, and Cypress. The handling of the main states was done with Redux for organization and simplification.

![Main Page](/docs/main-page.png)

The user can see the list of days to choose from, and now many available time slots there are in any given day. Clicking on the day will reveal which time slots have been booked, by whom, and with which interviewer.

![Appointment Form](/docs/appointment-form.png)

Clicking on the plus icon will reveal a new appointment form, where the user will enter their name, and choose whom to have their appointment with. Click save, and it's done! The user may then edit their appointment details, changing their name or choosing a new interviewer, or they may delete their appointment all together if they choose.

This app uses websockets to update in real time when new appointments are made, or when an appointment is deleted and a time slot is freed up.


## Setup

Install dependencies with `npm install`.

## Running Webpack Development Server

```sh
npm start
```

## Running Jest Test Framework

```sh
npm test
```

## Running Storybook Visual Testbed

```sh
npm run storybook
```
