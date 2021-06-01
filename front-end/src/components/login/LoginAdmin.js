import { makeStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import React, { useState } from "react";
import { openSnackBar } from "../snackBar/SnackBar";
import UserProfile from './SessionDetails';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(4),
  },
}));


export default function Login(props) { 
  const classes = useStyles();

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");


  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post('http://localhost:3001/login', {
        userName,
        password,
      })
      .then((res) => {
        if (res.status == 200 && res.data.message != "Wrong username/Password") 
          {
            const token = res.data.token;
            props.setLogin(token);
            sessionStorage.setItem('UserName', userName);
            UserProfile.setName(userName);
            console.log(userName);
            props.history.push("/patients");
            return;
          } else {
            openSnackBar({ message: "Authentication Error", type: "error" });
          }
      })
      .catch((error) => {
        let errorMessage;
        if (error.response) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        } else {
          errorMessage = "Authentication Error";
        }
        openSnackBar({ message: errorMessage, type: "error" });
      });
  };

  return (
    <Container maxWidth="sm" component="main" className={"MuiContainer--01"}>
      <Paper className={classes.paper}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography
                component="h1"
                variant="h5"
                align="center"
                color="textPrimary"
                gutterBottom
              >
                Login
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel htmlFor="username-input">User Name</InputLabel>
                <Input
                  id="username-input"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel htmlFor="password-input">Password</InputLabel>
                <Input
                  id="password-input"
                  value={password}
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                className={"MuiButton-Full"}
                variant="contained"
                size="large"
                color="primary"
              >
                Login
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                className={"MuiButton-Full"}
                href="/enroll/"
                size="large"
                color="primary"
              >
                Not Registered? Register now!
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}
