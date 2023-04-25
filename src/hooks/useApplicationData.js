import { useReducer, useEffect } from 'react';
import Axios from 'axios';

export default function useApplicationData() {

  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";

  function reducer(state, action) {
    switch (action.type) {
      case SET_DAY:
        return { ...state, day: action.day };
      case SET_APPLICATION_DATA:
        const { days, appointments, interviewers } = action;
        return { ...state, days, appointments, interviewers };
      case SET_INTERVIEW: {
        const { id, interview } = action;
        const appointment = {
          ...state.appointments[id],
          interview: interview ? { ...interview } : null
        };
        const appointments = {
          ...state.appointments,
          [id]: appointment
        };
        const days = updateSpots(state, appointments);
        return { ...state, appointments, days };
      }
      default:
        throw new Error(`Tried to reduce with unsupported action type: ${action.type}`);
    }
  }

  const [state, dispatch] = useReducer(reducer, { day: "Monday", days: [], appointments: {}, interviewers: {} });

  const setDay = (day) => dispatch({ type: SET_DAY, day });

  function updateSpots(state, appointments) {
    const days = state.days.map(d => {
      return { ...d, spots: d.appointments.filter(a => appointments[a].interview === null).length };
    });
    return days;
  }
  
  useEffect(() => {
    const url = process.env.REACT_APP_WEBSOCKET_URL;
    const webSocket = new WebSocket(url);
    
    webSocket.onopen = (event) => {
      webSocket.send("ping");
    };
    
    webSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type !== SET_INTERVIEW) {
        return console.log(event.data);
      }
      const { id, interview } = data;
      
      dispatch({ type: SET_INTERVIEW, id, interview });
    };

    Promise.all([
      Axios.get('http://localhost:8001/api/days'),
      Axios.get('http://localhost:8001/api/appointments'),
      Axios.get('http://localhost:8001/api/interviewers')
    ]).then((all) => {
      const [days, appointments, interviewers] = all;
      dispatch({ type: SET_APPLICATION_DATA, days: days.data, appointments: appointments.data, interviewers: interviewers.data });
    });

  }, []);


  function bookInterview(id, interview) {
    return Axios.put(`/api/appointments/${id}`, { interview })
      .then(() => {
        return dispatch({ type: SET_INTERVIEW, id, interview });
      });
  }

  function cancelInterview(id) {
    return Axios.delete(`/api/appointments/${id}`)
      .then(() => {
        return dispatch({ type: SET_INTERVIEW, id, interview: null });
      });
  }

  return { state, setDay, bookInterview, cancelInterview };
};