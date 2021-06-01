import { createMuiTheme, CssBaseline } from "@material-ui/core";
import { green, red } from "@material-ui/core/colors";
import { responsiveFontSizes } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import AboutUs from "../aboutUs/AboutUs";
import WithAuth from "../auth/WithAuth";
import DoctorData from "../doctor/DoctorData";
import Enroll from "../enroll/Enroll";
import Footer from "../footer/Footer";
import Home from "../home/Home";
import LoginAdmin from "../login/LoginAdmin";
import LoginDoctor from "../login/LoginDoctor";
import LoginPatient from "../login/LoginPatient";
import PatientChangePassword from "../login/PatientChangePassword";
import NavBar from "../navBar/NavBar";
import PatientData from "../patient/PatientData";
import Patients from "../patients/Patients";
import Profile from "../profile/Profile";
import SnackBar from "../snackBar/SnackBar";
import "./App.css";

let theme = createMuiTheme({
  palette: {
    background: {
      default: "#f1f1f1",
    },
    success: {
      main: green[600],
    },
    error: {
      main: red[600],
    },
  },
  overrides: {
    MuiContainer: {
      root: {
        "&.MuiContainer--01": {
          padding: "64px 0px",
          justifyContent: "center",
          alignItems: "center",
        },
      },
    },
    MuiButton: {
      root: {
        "&.MuiButton-Full": {
          width: "100%",
          minWidth: 275,
        },
      },
    },
    MuiBox: {
      root: {
        "&.MuiBox-RightAlign": {
          display: "inline-block",
          marginLeft: "auto",
        },
        "&.MuiBox-CenterAlign": {
          display: "inline-block",
          alignItems: "center",
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);

export default function App() {
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem("jwtToken"));

  const login = (token) => {
    localStorage.setItem("jwtToken", token);
    setLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("jwtToken");
    setLoggedIn(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <NavBar loggedIn={loggedIn} setLogout={logout} />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route
            path="/login/admin"
            render={(props) =>
              loggedIn ? (
                <Redirect to="/patient/:ID" />
              ) : (
                <LoginAdmin {...props} setLogin={login} />
              )
            }
          />
          <Route
            path="/login/patient"
            render={(props) =>
              loggedIn ? (
                <Redirect to="/patients" />
              ) : (
                <LoginPatient {...props} setLogin={login} />
              )
            }
          />
          <Route
            path="/login/doctor"
            render={(props) =>
              loggedIn ? (
                <Redirect to="/patients" />
              ) : (
                <LoginDoctor {...props} setLogin={login} />
              )
            }
          />
          <Route
            path="/profile"
            render={(props) => <WithAuth Component={Profile} {...props} />}
          />
          <Route
            path="/enroll"
            render={(props) =>
              loggedIn ? <Redirect to="/patients" /> : <Enroll {...props} />
            }
          />
          <Route
            path="/patients"
            render={(props) => <WithAuth Component={Patients} {...props} />}
          />
          <Route
            path="/patient/:PID"
            render={(props) => <WithAuth Component={PatientData} {...props} />}
          />
          <Route
            path="/doctor/:DID"
            render={(props) => <WithAuth Component={DoctorData} {...props} />}
          />
          <Route
            path="/patientChangePassword"
            component={PatientChangePassword}
          />
          <Route path="/aboutus" component={AboutUs} />
        </Switch>
        <SnackBar />
        <Footer />
      </Router>
    </ThemeProvider>
  );
}
