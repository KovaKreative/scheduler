import React from "react";
import "./styles.scss";

import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "components/Form";

import useVisualMode from 'hooks/useVisualMode';

export default function Appointment(props) {
  const MODE = Object.freeze({
    EMPTY: "EMPTY",
    SHOW: "SHOW",
    CREATE: "CREATE"
  });

  const interview = props.interview;
  const { mode, transition, back } = useVisualMode(interview ? MODE.SHOW : MODE.EMPTY);

  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === MODE.EMPTY && <Empty onAdd={() => transition(MODE.CREATE)} />}
      {mode === MODE.SHOW && <Show student={interview.student} interviewer={interview.interviewer} />}
      {mode === MODE.CREATE && <Form student={[]} interviewers={props.interviewers} onCancel={back} />}
    </article>
  );
}