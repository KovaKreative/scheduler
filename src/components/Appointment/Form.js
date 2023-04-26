import React, { useState } from "react";

import InterviewerList from "../InterviewerList";
import Button from "../Button";

export default function Form(props) {

  const [student, setStudent] = useState(props.student || "");
  const [interviewer, setInterviewer] = useState(props.interviewer || null);
  const [error, setError] = useState("");

  function validate(student, interviewer) {
    if (!student.length) {
      return setError("Student name cannot be blank");
    }
    if (interviewer === null) {
      return setError("Please select an interviewer");
    }
    setError("");
    props.onSave(student, interviewer);
  }

  function reset() {
    setError("");
    setStudent("");
    setInterviewer(null);
  };

  function cancel() {
    reset();
    props.onCancel();
  };

  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off" onSubmit={event => event.preventDefault()}>
          <input
            className="appointment__create-input text--semi-bold"
            name="name"
            type="text"
            placeholder="Enter Student Name"
            value={student}
            onChange={event => setStudent(event.target.value)}
            data-testid="student-name-input"
          />
        </form>
        {error && <section className="appointment__validation">{error}</section>}
        <InterviewerList interviewer={interviewer}
          interviewers={props.interviewers} value={interviewer} onChange={setInterviewer}
        />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger onClick={cancel}>Cancel</Button>
          <Button
            confirm
            onClick={() => {
              validate(student, interviewer);
            }
            }>Save</Button>
        </section>
      </section>
    </main>
  );
}