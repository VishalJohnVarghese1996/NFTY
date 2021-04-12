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

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(4),
  },
}));

export default function Enroll(props) {
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");
  const [userid, setUserid] = useState("");

  const classes = useStyles();

  const validateForm = () => {
    let errors = [];
    if (newPassword !== newPasswordConfirmation) {
      errors.push("The passwords do not match");
    }
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (errors.length) {
      errors.forEach((error) => {
        openSnackBar({ message: error, type: "error" });
      });
    } else {
      console.log("44", newPassword);
      axios
        .post(`http://localhost:3001/register`, {
          userid,
          username,
          newPassword,
        })
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            openSnackBar({ message: res.data.message, type: "success" });
            props.history.push("/login");
            return;
          } else {
            openSnackBar({ message: "Authentication Error", type: "error" });
          }
        })
        .catch((error) => {
          console.log(error);
          openSnackBar({ message: error.response.data.message, type: "error" });
        });
    }
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
                Registration of New User
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel htmlFor="username-input">User Name</InputLabel>
                <Input
                  id="username-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel htmlFor="username-input">User Id</InputLabel>
                <Input
                  id="userid-input"
                  value={userid}
                  onChange={(e) => setUserid(e.target.value)}
                  required
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel htmlFor="newpassword-input">Password</InputLabel>
                <Input
                  id="newpassword-input"
                  value={newPassword}
                  type="password"
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel htmlFor="newpassword-confirmation-input">
                  Confirm Password
                </InputLabel>
                <Input
                  id="newpassword-confirmation-input"
                  value={newPasswordConfirmation}
                  type="password"
                  onChange={(e) => setNewPasswordConfirmation(e.target.value)}
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
                Enroll
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                className={"MuiButton-Full"}
                href="/login/"
                size="large"
                color="primary"
              >
                Go back to login
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}
