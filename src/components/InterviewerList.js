import React from "react";

import InterviewerListItem from "./InterviewerListItem";

import "./InterviewerList.scss"

export default function InterviewerList(props) {

  const interviewerList = props.interviewers.map(i => {
    return <InterviewerListItem key={i.id} name={i.name} avatar={i.avatar} selected={i.id === props.value} setInterviewer={() => {props.onChange(i.id)}}  />;
  });


  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">{interviewerList}</ul>
    </section>
  );
}