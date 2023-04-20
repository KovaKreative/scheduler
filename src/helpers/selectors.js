export function getAppointmentsForDay(state) {
  const selectedDay = state.days.find(d => d.name === state.day);
  const appointments = [];
  
  selectedDay && selectedDay.appointments.forEach(x => {
    appointments.push(state.appointments[x]);
  });
  return appointments;
}