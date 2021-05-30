import { withStyles } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import React, { useEffect, useState } from "react";
import PatientListEHR from "../patientList/PatientListEHR";

const styles = (theme) => ({
  card: {
    minWidth: 275,
    margin: theme.spacing(1),
  },
});

function DoctorCard(props) {
  const path = props.location.pathname;
  const DID = path.slice(path.lastIndexOf("/")).slice(1);
  const [doctorData, setDoctorData] = useState({});
  const [patientData, setPatientData] = useState([]);

  useEffect(() => {
    let patId = [];
    let tempPatientData = [];
    axios
      .get(`http://localhost:3001/doctor/${DID}`, {
        headers: {
          "x-access-token": localStorage.getItem("jwtToken"),
        },
      })
      .then((result) => {
        setDoctorData(result.data[0]);
      });
    axios
      .get(`http://localhost:3001/doctorRelatedToPatient/${DID}`, {
        headers: {
          "x-access-token": localStorage.getItem("jwtToken"),
        },
      })
      .then((result) => {
        for (let i = 0; i < result.data.length; i++) {
          patId.push(result.data[i].PID);
        }
        axios
          .get(`http://localhost:3001/patients/`, {
            headers: {
              "x-access-token": localStorage.getItem("jwtToken"),
            },
          })
          .then((result) => {
            tempPatientData = result.data.filter((result) => {
              return patId.includes(result.PID);
            });
            for (let i = 0; i < tempPatientData.length; i++) {
              axios
                .get(
                  `http://localhost:3001/getEHRRelated/${DID}/${tempPatientData[i].PID}`,
                  {
                    headers: {
                      "x-access-token": localStorage.getItem("jwtToken"),
                    },
                  }
                )
                .then((result) => {
                  tempPatientData[i].EHR = result.data[0].EncryptedEHR;
                });
            }
            setPatientData(tempPatientData);
          });
      });
  }, [DID]);

  return (
    <div>
      <Card>
        <CardContent>
          <Box mb={1}>
            <Typography color="textSecondary" gutterBottom>
              DID {doctorData.DID}
            </Typography>
            <Typography variant="h5" component="h2">
              {doctorData.FirstName} {doctorData.LastName}
            </Typography>
            <Typography color="textSecondary">
              Specialization: {doctorData.Specialization}
            </Typography>
            <Typography color="textSecondary">
              Address: {doctorData.Address}
            </Typography>
          </Box>
        </CardContent>
      </Card>
      <h1>Patients</h1>
      <PatientListEHR patients={patientData ? patientData : []} />
    </div>
  );
}

export default withStyles(styles, { withTheme: true })(DoctorCard);
