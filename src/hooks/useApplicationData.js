import { useState, useEffect } from 'react';
import Axios from 'axios';

export default function useApplicationData() {

  const [state, setState] = useState({ day: "Monday", days: [], appointments: {}, interviewers: {} });

  const setDay = day => setState(prev => ({ ...prev, day }));

  function updateSpots(appointments) {
    let days = state.days.map(d => {
      return { ...d, spots: d.appointments.filter(a => appointments[a].interview === null).length };
    });
    return days;
  }

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


  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    const days = updateSpots(appointments);
    return Axios.put(`/api/appointments/${id}`, { interview })
      .then(res => {
        return setState({ ...state, appointments, days });
      });
  }

  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };

    return Axios.delete(`/api/appointments/${id}`)
      .then(() => {
        const appointments = { ...state.appointments, [id]: appointment };
        const days = updateSpots(appointments);
        setState({ ...state, appointments, days  });
      });
  }

  return { state, setDay, bookInterview, cancelInterview };
};