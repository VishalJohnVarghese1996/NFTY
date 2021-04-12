import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import { default as React } from "react";

export default function PatientList(props) {
  const doctors = props.doctors;
  const filter = props.filter;
  //First filter the patients by the text
  console.log(doctors);

  const removeDoctor = (DID) => {
    axios
      .post(
        `http://localhost:3001/doctor/remove`,
        {
          DID,
        },
        {
          headers: {
            "x-access-token": localStorage.getItem("jwtToken"),
          },
        }
      )
      .then((res) => {
        console.log("Removed Successfully");
      });
  };

  const listOfDoctors = doctors
    .filter(function (doctor) {
      return (
        doctor.DID.includes(filter) ||
        `${doctor.firstName} ${doctor.lastName}`.includes(filter) ||
        `${doctor.lastName} ${doctor.firstName}`.includes(filter)
      );
    })
    .map((doctor) => (
      <li key={doctor.DID}>
        <Card>
          <CardContent>
            <Box mb={1}>
              <Typography color="textSecondary" gutterBottom>
                DID {doctor.DID}
              </Typography>
              <Typography variant="h5" component="h2">
                {doctor.FirstName} {doctor.LastName}
              </Typography>
              <Typography color="textSecondary">
                Specialization: {doctor.Specialization}
              </Typography>
              <Typography color="textSecondary">
                Address: {doctor.Address}
              </Typography>
            </Box>
            <Button onClick={() => removeDoctor(doctor.DID)}>Remove</Button>
          </CardContent>
        </Card>
        <div style={{ marginTop: "10px" }} />
      </li>
    ));

  return <ul>{listOfDoctors}</ul>;
}
