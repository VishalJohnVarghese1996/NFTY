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

export default function Login(props) {
  const [userid, setUserid] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const classes = useStyles();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`http://localhost:3001/patientChangePassword`, {
        userid,
        oldPassword,
        newPassword,
        confirmPassword,
      })
      .then((res) => {
        if (
          res.status === 200 &&
          res.data.message !== "Wrong UserID/Password"
        ) {
          const token = res.data.token;
          props.setLogin(token);
          props.history.push(`/patient/${userid}`);
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
                Please provide userId, Old Password and New Password
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel htmlFor="username-input">User ID</InputLabel>
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
                <InputLabel htmlFor="password-input">Old Password</InputLabel>
                <Input
                  id="firstname-input"
                  value={oldPassword}
                  type="password"
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel htmlFor="password-input">New Password</InputLabel>
                <Input
                  id="firstname-input"
                  value={newPassword}
                  type="password"
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel htmlFor="password-input">
                  Confirm New Password
                </InputLabel>
                <Input
                  id="firstname-input"
                  value={confirmPassword}
                  type="password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                Change Password
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}
