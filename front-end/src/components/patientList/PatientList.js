import React from "react";
import PatientCard from "../patient/PatientCard";

export default function PatientList(props) {
  const patients = props.patients;
  const filter = props.filter;
  //First filter the patients by the text
  console.log(patients);
  const listOfPatients = patients
    .filter(function (patient) {
      return (
        patient.PID.includes(filter) ||
        `${patient.firstName} ${patient.lastName}`.includes(filter) ||
        `${patient.lastName} ${patient.firstName}`.includes(filter)
      );
    })
    .map((patient) => (
      <li key={patient.PID}>
        <PatientCard {...patient} />
      </li>
    ));

  return <ul>{listOfPatients}</ul>;
}
