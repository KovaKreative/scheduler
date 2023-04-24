import React from 'react';

import "components/Application.scss";

import DayList from "./DayList";
import Appointment from './Appointment';

import { getAppointmentsForDay, getInterviewersForDay, getInterview } from 'helpers/selectors';

import useApplicationData from 'hooks/useApplicationData';

export default function Application() {

  const { state, setDay, bookInterview, cancelInterview } = useApplicationData();

  const dailyAppointments = getAppointmentsForDay(state);
  const dailyInterviewers = getInterviewersForDay(state);

  const appointmentComponents = dailyAppointments.map(a => {
    return <Appointment
      key={a.id}
      id={a.id}
      interview={getInterview(state, a.interview)}
      interviewers={dailyInterviewers}
      time={a.time}
      bookInterview={bookInterview}
      cancelInterview={cancelInterview}
    />;
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
