import React from "react";
import "./styles.scss";

import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "components/Form";
import Status from "./Status";

import useVisualMode from 'hooks/useVisualMode';

export default function Appointment(props) {
  const MODE = Object.freeze({
    EMPTY: "EMPTY",
    SHOW: "SHOW",
    CREATE: "CREATE",
    SAVING: "SAVING"
  });
  const interview = props.interview;
  const { mode, transition, back } = useVisualMode(interview ? MODE.SHOW : MODE.EMPTY);

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(MODE.SAVING);
    props.bookInterview(props.id, interview).then(() => { transition(MODE.SHOW); });
  }

  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === MODE.EMPTY && <Empty onAdd={() => transition(MODE.CREATE)} />}
      {mode === MODE.SHOW && <Show student={interview.student} interviewer={interview.interviewer} />}
      {mode === MODE.CREATE && <Form student={[]} interviewers={props.interviewers} onCancel={back} onSave={save} />}
      {mode === MODE.SAVING && <Status />}
    </article>
  );
}