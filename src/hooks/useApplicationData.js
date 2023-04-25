import { useReducer, useEffect } from 'react';
import Axios from 'axios';

export default function useApplicationData() {

  // const [state, setState] = useState({ day: "Monday", days: [], appointments: {}, interviewers: {} });


  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";

  function reducer(state, action) {
    switch (action.type) {
      case SET_DAY:
        return { ...state, day:action.day };
      case SET_APPLICATION_DATA:
        const { days, appointments, interviewers } = action;
        return { ...state, days, appointments, interviewers };
      case SET_INTERVIEW: {
        const { appointments, days } = action;
        return { ...state, appointments, days };
      }
      default:
        throw new Error(`Tried to reduce with unsupported action type: ${action.type}`);
    }
  }

  const [state, dispatch] = useReducer(reducer, { day: "Monday", days: [], appointments: {}, interviewers: {} });

  const setDay = (day) => dispatch({ type: SET_DAY, day });

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
        dispatch({ type: SET_APPLICATION_DATA, days, appointments, interviewers });
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
      .then(() => {
        return dispatch({ type: SET_INTERVIEW, appointments, days });
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
        return dispatch({ type: SET_INTERVIEW, appointments, days });
      });
  }

  return { state, setDay, bookInterview, cancelInterview };
};