import React, { useEffect } from "react";
import "./styles.scss";

import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "components/Form";
import Confirm from "./Confirm";
import Status from "./Status";
import Error from "./Error";

import useVisualMode from 'hooks/useVisualMode';

export default function Appointment(props) {
  const MODE = Object.freeze({
    EMPTY: "EMPTY",
    SHOW: "SHOW",
    CREATE: "CREATE",
    EDIT: "EDIT",
    CONFIRM: "CONFIRM",
    SAVING: "SAVING",
    ERROR_SAVE: "ERROR_SAVE",
    DELETING: "DELETING",
    ERROR_DELETE: "ERROR_DELETE"
  });
  const interview = props.interview;

  const { mode, transition, back } = useVisualMode(interview ? MODE.SHOW : MODE.EMPTY);

  useEffect(() => {
    if (interview && mode === MODE.EMPTY) {
     transition(MODE.SHOW);
    }
    if (interview === null && mode === MODE.SHOW) {
     transition(MODE.EMPTY);
    }
   }, [interview, transition, mode]);
   

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };

    transition(MODE.SAVING);

    props.bookInterview(props.id, interview)
      .then(() => { transition(MODE.SHOW); })
      .catch(err => {
        transition(MODE.ERROR_SAVE, true);
      });

  }

  function deleteInterview() {
    transition(MODE.DELETING);
    props.cancelInterview(props.id)
      .then(() => { transition(MODE.EMPTY); })
      .catch(err => {
        transition(MODE.ERROR_DELETE, true);
      });
  }

  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === MODE.EMPTY && <Empty onAdd={() => transition(MODE.CREATE)} />}
      {mode === MODE.SHOW && interview && <Show student={interview.student} interviewer={interview.interviewer} onEdit={() => transition(MODE.EDIT)} onDelete={() => transition(MODE.CONFIRM)} />}
      {mode === MODE.CREATE && <Form student={[]} interviewers={props.interviewers} onCancel={back} onSave={save} />}
      {mode === MODE.EDIT && <Form student={interview.student} interviewer={interview.interviewer.id} interviewers={props.interviewers} onCancel={back} onSave={save} />}
      {mode === MODE.SAVING && <Status message="Saving..." />}
      {mode === MODE.CONFIRM && <Confirm message="Delete the appointment?" onConfirm={deleteInterview} onCancel={() => transition(MODE.SHOW)} />}
      {mode === MODE.DELETING && <Status message="Deleting..." />}
      {mode === MODE.ERROR_SAVE && <Error message="Could not save the appointment details" onClose={back} />}
      {mode === MODE.ERROR_DELETE && <Error message="Could not delete the appointment" onClose={back} />}
    </article>
  );
}