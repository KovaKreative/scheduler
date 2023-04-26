import React from "react";

import DayListItem from "./DayListItem";

export default function DayList(props) {

  const dayList = props.days.map(d => {
    return <DayListItem key={d.id} setDay={props.onChange} name={d.name} spots={d.spots} selected={d.name === props.value} />
  });

  return (<ul>{dayList}</ul>);
}