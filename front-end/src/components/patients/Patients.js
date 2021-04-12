import { Container } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/styles";
import axios from "axios";
import React from "react";
import AddDoctorForm from "../addDoctor/AddDoctorForm";
import AddPatientForm from "../addPatient/AddPatientForm";
import DoctorList from "../doctorList/DoctorList";
import PatientList from "../patientList/PatientList";
import SearchBoxPatients from "../searchBoxPatients/SearchBoxPatients";
import { openSnackBar } from "../snackBar/SnackBar";

const styles = (theme) => ({
  box: {
    margin: theme.spacing(1),
  },
});

class Patients extends React.Component {
  constructor(props) {
    super(props);
    console.log(this);
    this.state = {
      patients: [],
      filterPatient: "",
      addingPatient: false,
      doctors: [],
      filterDoctor: "",
      addingDoctor: false,
    };
    this.handlePatientFilterChange = this.handlePatientFilterChange.bind(this);
    this.handleDoctorFilterChange = this.handleDoctorFilterChange.bind(this);
    this.toogleAddingPatientStatus = this.toogleAddingPatientStatus.bind(this);
    this.toogleAddingDoctorStatus = this.toogleAddingDoctorStatus.bind(this);
    this.addPatient = this.addPatient.bind(this);
    this.addDoctor = this.addDoctor.bind(this);
  }

  componentDidMount() {
    axios
      .get(`http://localhost:3001/patients/`, {
        headers: {
          "x-access-token": localStorage.getItem("jwtToken"),
        },
      })
      .then(
        (result) => {
          console.log(result.data);
          this.setState({
            patients: result.data,
            filterPatient: this.state.filterPatient,
            addingPatient: this.state.addingPatient,
            doctors: this.state.doctors,
            filterDoctor: this.state.filterDoctor,
            addingDoctor: this.state.addingDoctor,
          });
        },
        (error) => {
          openSnackBar({ message: error.response.data.message, type: "error" });
        }
      );
    axios
      .get(`http://localhost:3001/doctors/`, {
        headers: {
          "x-access-token": localStorage.getItem("jwtToken"),
        },
      })
      .then(
        (result) => {
          console.log(result.data);
          this.setState({
            patients: this.state.patients,
            filterPatient: this.state.filterPatient,
            addingPatient: this.state.addingPatient,
            doctors: result.data,
            filterDoctor: this.state.filterDoctor,
            addingDoctor: this.state.addingDoctor,
          });
        },
        (error) => {
          openSnackBar({ message: error.response.data.message, type: "error" });
        }
      );
  }

  handlePatientFilterChange(newValue) {
    this.setState({ filterPatient: newValue });
  }

  handleDoctorFilterChange(newValue) {
    this.setState({ filterDoctor: newValue });
  }

  toogleAddingPatientStatus() {
    this.setState({ addingPatient: !this.state.addingPatient });
    console.log("hi");
  }

  toogleAddingDoctorStatus() {
    this.setState({ addingDoctor: !this.state.addingDoctor });
  }

  addPatient(newPatient) {
    let newPatientsList = this.state.patients;
    newPatientsList.unshift(newPatient);
    this.setState(
      { patients: newPatientsList },
      this.toogleAddingPatientStatus
    );
  }

  addDoctor(newDoctor) {
    let newDoctorsList = this.state.doctors;
    newDoctorsList.unshift(newDoctor);
    this.setState({ doctors: newDoctorsList }, this.toogleAddingDoctorStatus);
  }

  render() {
    const { classes } = this.props;
    const patients = this.state.patients;
    const filterPatient = this.state.filterPatient;
    const doctors = this.state.doctors;
    const filterDoctor = this.state.filterDoctor;
    let addingPatient;
    let addingDoctor;

    if (this.state.addingPatient) {
      addingPatient = (
        <AddPatientForm
          addPatient={this.addPatient}
          cancel={this.toogleAddingPatientStatus}
        />
      );
    } else {
      addingPatient = (
        <Box className={classes.box}>
          <Button
            className={"MuiButton-Full"}
            onClick={this.toogleAddingPatientStatus}
          >
            Add Patient
          </Button>
        </Box>
      );
    }
    if (this.state.addingDoctor) {
      addingDoctor = (
        <AddDoctorForm
          addDoctor={this.addDoctor}
          cancel={this.toogleAddingDoctorStatus}
        />
      );
    } else {
      addingDoctor = (
        <Box className={classes.box}>
          <Button
            className={"MuiButton-Full"}
            onClick={this.toogleAddingDoctorStatus}
          >
            Add Doctor
          </Button>
        </Box>
      );
    }
    return (
      <div>
        <div style={{ width: "50%", float: "left" }}>
          <Container
            maxWidth="sm"
            component="main"
            className={"MuiContainer--01"}
          >
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="textPrimary"
              gutterBottom
            >
              Patients
            </Typography>
            <Typography
              variant="h5"
              align="center"
              color="textSecondary"
              component="p"
            >
              List of Patients
            </Typography>
            <SearchBoxPatients
              inputValue={filterPatient}
              onFilterChange={this.handlePatientFilterChange}
            />
            {addingPatient}
            <PatientList
              patients={patients ? patients : []}
              filterPatient={filterPatient}
            />
          </Container>
        </div>
        <div style={{ width: "50%", float: "left" }}>
          <Container
            maxWidth="sm"
            component="main"
            className={"MuiContainer--01"}
          >
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="textPrimary"
              gutterBottom
            >
              Doctors
            </Typography>
            <Typography
              variant="h5"
              align="center"
              color="textSecondary"
              component="p"
            >
              List of Doctors
            </Typography>
            <SearchBoxPatients
              inputValue={filterDoctor}
              onFilterChange={this.handleDoctorFilterChange}
            />
            {addingDoctor}
            <DoctorList
              doctors={doctors ? doctors : []}
              filterDoctor={filterDoctor}
            />
          </Container>
        </div>
      </div>
    );
  }
}
export default withStyles(styles, { withTheme: true })(Patients);
