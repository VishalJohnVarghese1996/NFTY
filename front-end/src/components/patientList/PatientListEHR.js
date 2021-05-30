import React from "react";
import PatientCardEHR from "../patient/PatientCardEHR";

export default function PatientList(props) {
  const patients = props.patients;
  console.log(patients);
  return (
    <ul>
      {patients.map((patient) => (
        <li key={patient.PID}>
          <PatientCardEHR {...patient} />
        </li>
      ))}
    </ul>
  );
}
