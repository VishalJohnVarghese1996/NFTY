import { withStyles } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import React, { useEffect, useState } from "react";

const styles = (theme) => ({
  card: {
    minWidth: 275,
    margin: theme.spacing(1),
  },
});

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

function PatientCard(props) {
  const path = props.location.pathname;
  const PID = path.slice(path.lastIndexOf("/")).slice(1);
  const [patientData, setPatientData] = useState({});
  const [isExpanded, setisExpanded] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]);
  const [addedDoctor, setAddedDoctor] = useState("");
  const classes = useStyles();

  useEffect(() => {
    let doctorsId = [];
    axios
      .get(`http://localhost:3001/patient/${PID}`, {
        headers: {
          "x-access-token": localStorage.getItem("jwtToken"),
        },
      })
      .then((result) => {
        setPatientData(result.data[0]);
      });
    axios
      .get(`http://localhost:3001/patientRelatedToDoctor/${PID}`, {
        headers: {
          "x-access-token": localStorage.getItem("jwtToken"),
        },
      })
      .then((result) => {
        for (let i = 0; i < result.data.length; i++) {
          doctorsId.push(result.data[i].DID);
        }
        axios
          .get(`http://localhost:3001/doctors/`, {
            headers: {
              "x-access-token": localStorage.getItem("jwtToken"),
            },
          })
          .then((result) => {
            setAllDoctors(result.data);
            setDoctors(
              result.data.filter((doctor) => {
                return doctorsId.includes(doctor.DID);
              })
            );
          });
      });
  }, [PID]);

  const handleChange = (e) => {
    setAddedDoctor(e.target.value);
  };

  const onRemoveDoctor = (DID, PID) => {
    setDoctors(doctors.filter((doctor) => doctor.DID !== DID));
    axios
      .post(
        `http://localhost:3001/relatedDoctor/remove`,
        {
          PID,
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

  const onAddDoctor = (DID, EHR) => {
    axios
      .post(
        `http://localhost:3001/relatedDoctor/add`,
        {
          PID,
          DID,
					EHR
        },
        {
          headers: {
            "x-access-token": localStorage.getItem("jwtToken"),
          },
        }
      )
      .then((res) => {
        console.log("Added Successfully");
      });
  };

  return (
    <div>
      <Card>
        <CardContent>
          <Box mb={1}>
            <Typography color="textSecondary" gutterBottom>
              PID {patientData.PID}
            </Typography>
            <Typography variant="h5" component="h2">
              {patientData.FirstName} {patientData.LastName}
            </Typography>
            <Typography color="textSecondary">
              Age: {patientData.Age}
            </Typography>
            <Typography color="textSecondary">
              Address: {patientData.Address}
            </Typography>
          </Box>
          {isExpanded ? (
            <Typography color="textSecondary">
              EHR: {patientData.EHR}
            </Typography>
          ) : null}
        </CardContent>
        <CardActions>
          {isExpanded ? (
            <Button size="small" onClick={() => setisExpanded(false)}>
              Shrink
            </Button>
          ) : (
            <Button size="small" onClick={() => setisExpanded(true)}>
              Expand
            </Button>
          )}
        </CardActions>
      </Card>
      <div style={{ marginTop: "10px" }} />
      <Typography variant="h3">Doctors</Typography>
      {doctors.map((doctorData) => (
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
            <Button
              size="small"
              onClick={() => onRemoveDoctor(doctorData.DID, PID)}
            >
              Remove
            </Button>
          </CardContent>
        </Card>
      ))}
      <div style={{ marginTop: "10px" }} />
      <Typography variant="h4">Add Doctor</Typography>
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-label">Doctors</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          onChange={handleChange}
          value={addedDoctor}
          defaultValue=""
        >
          {allDoctors.map((doctor) => (
            <MenuItem value={doctor.DID}>{doctor.FirstName}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button
        color="primary"
        onClick={() => onAddDoctor(addedDoctor, patientData.EHR)}
        style={{ marginTop: "23px" }}
      >
        Add
      </Button>
    </div>
  );
}

export default withStyles(styles, { withTheme: true })(PatientCard);
