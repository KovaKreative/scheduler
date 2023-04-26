import React from "react";

import './InterviewerListItem.scss'

import classNames from "classnames";


export default function(props) {

  const interviewerListItemClass = classNames("interviewers__item", { 'interviewers__item--selected': props.selected });


  return (
    <li className={interviewerListItemClass} onClick={props.setInterviewer} data-testid="interviewer">
      <img
        className="interviewers__item-image"
        src={props.avatar}
        alt={props.name}
      />
      {props.selected && props.name}
    </li>

  );
}