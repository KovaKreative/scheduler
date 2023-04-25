export function getAppointmentsForDay(state, day) {
  const selectedDay = state.days.find(d => d.name === (day || state.day));
  const appointments = [];

  selectedDay && selectedDay.appointments.forEach(x => {
    appointments.push(state.appointments[x]);
  });
  return appointments;
}

export function getInterviewersForDay(state, day) {
  const selectedDay = state.days.find(d => d.name === (day || state.day));
  const interviewers = [];

  selectedDay && selectedDay.interviewers.forEach(x => {
    interviewers.push(state.interviewers[x]);
  });
  return interviewers;
}


export function getInterview(state, interview) {
  if (!interview) return null;
  const interviewer = state.interviewers[interview.interviewer];
  const outputInterview = {
    student: interview.student,
    interviewer: interviewer
  };
  return outputInterview;
}