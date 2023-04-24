import { useState, useEffect } from 'react';
import Axios from 'axios';

export default function useApplicationData() {

  const [state, setState] = useState({ day: "Monday", days: [], appointments: {}, interviewers: {} });

  const setDay = day => setState(prev => ({ ...prev, day }));

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

  function updateSpots() {
    // const appointments = state.days[0].appointments.map(a => {
    //   return state.appointments[a];
    // });
    const spots = state.days[0].appointments.filter(a => {
      console.log(state.appointments[a].interview);
      return state.appointments[a].interview !== null;
    }).length;
    console.log(spots);
  }

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    return Axios.put(`/api/appointments/${id}`, { interview })
      .then(res => {
        updateSpots();
        setState({ ...state, appointments });
      });
  }

  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };

    return Axios.delete(`/api/appointments/${id}`)
      .then(() => {
        setState({ ...state, appointments: { ...state.appointments, [id]: appointment } });
      });
  }

  return { state, setDay, bookInterview, cancelInterview };
};