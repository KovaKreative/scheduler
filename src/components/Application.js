import React, { useState, useEffect } from 'react';

import "components/Application.scss";

import DayList from "./DayList";
import Appointment from './Appointment';

import Axios from 'axios';

import { getAppointmentsForDay } from 'helpers/selectors';

// const interviewers = [
//   { id: 1, name: "Sylvia Palmer", avatar: "https://i.imgur.com/LpaY82x.png" },
//   { id: 2, name: "Tori Malcolm", avatar: "https://i.imgur.com/Nmx0Qxo.png" },
//   { id: 3, name: "Mildred Nazir", avatar: "https://i.imgur.com/T2WwVfS.png" },
//   { id: 4, name: "Cohana Roy", avatar: "https://i.imgur.com/FK8V841.jpg" },
//   { id: 5, name: "Sven Jones", avatar: "https://i.imgur.com/twYrpay.jpg" }
// ];

// const appointments = {
//   "1": {
//     id: 1,
//     time: "12pm",
//   },
//   "2": {
//     id: 2,
//     time: "1pm",
//     interview: {
//       student: "Lydia Miller-Jones",
//       interviewer:{
//         id: 3,
//         name: "Sylvia Palmer",
//         avatar: "https://i.imgur.com/LpaY82x.png",
//       }
//     }
//   },
//   "3": {
//     id: 3,
//     time: "2pm",
//   },
//   "4": {
//     id: 4,
//     time: "3pm",
//     interview: {
//       student: "Archie Andrews",
//       interviewer:{
//         id: 4,
//         name: "Cohana Roy",
//         avatar: "https://i.imgur.com/FK8V841.jpg",
//       }
//     }
//   },
//   "5": {
//     id: 5,
//     time: "4pm",
//   }
// };



export default function Application() {
  const [state, setState] = useState({ day: "Monday", days: [], appointments: {} });

  const setDay = day => setState(prev => ({ ...prev, day }));
  const setDays = daysArray => setState(prev => ({ ...prev, days: daysArray }));

  const dailyAppointments = getAppointmentsForDay(state);

  const appointmentComponents = dailyAppointments.map(a => {
    return <Appointment key={a.id} {...a} />;
  });

  appointmentComponents.push(<Appointment key="last" time="5pm" />);

  useEffect(() => {

    Promise.all([Axios.get('http://localhost:8001/api/days'), Axios.get('http://localhost:8001/api/appointments')])
      .then((all) => {
        const [days, appointments] = all;
        setState(prev => ({ ...prev, days: days.data, appointments: appointments.data }));
      });
  }, []);

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <DayList days={state.days} value={state.day} onChange={setDay} />
        <nav className="sidebar__menu"></nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {appointmentComponents}
      </section>
    </main>
  );
}
