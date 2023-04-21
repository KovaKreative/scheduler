import React, { useState, useEffect } from 'react';

import "components/Application.scss";

import DayList from "./DayList";
import Appointment from './Appointment';

import Axios from 'axios';

import { getAppointmentsForDay, getInterview, getInterviewersForDay } from 'helpers/selectors';

export default function Application() {
  const [state, setState] = useState({ day: "Monday", days: [], appointments: {}, interviewers: {} });

  const setDay = day => setState(prev => ({ ...prev, day }));

  const dailyAppointments = getAppointmentsForDay(state);
  const dailyInterviewers = getInterviewersForDay(state);

  useEffect(() => {

    Promise.all([
      Axios.get('http://localhost:8001/api/days'),
      Axios.get('http://localhost:8001/api/appointments'),
      Axios.get('http://localhost:8001/api/interviewers')
    ])
      .then((all) => {
        const [days, appointments, interviewers] = all;
        setState(prev => ({ ...prev, days: days.data, appointments: appointments.data, interviewers: interviewers.data }));
      });
  }, []);

  const appointmentComponents = dailyAppointments.map(a => {
    return <Appointment key={a.id} id={a.id} interview={getInterview(state, a.interview)} interviewers={dailyInterviewers} time={a.time} />;
  });

  appointmentComponents.push(<Appointment key="last" time="5pm" />);


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
