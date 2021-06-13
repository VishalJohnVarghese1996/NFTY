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

import Web3 from 'web3'
import { TODO_LIST_ABI, TODO_LIST_ADDRESS } from '../../config'

const web3 = new Web3(Web3.givenProvider);
const NftContract = new web3.eth.Contract(TODO_LIST_ABI, TODO_LIST_ADDRESS);

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(4),
  },
}));

export default function Login(props) {  
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const classes = useStyles();

  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const accounts = await window.ethereum.enable();
    const account = accounts[0];

    axios
      .post(`http://localhost:3001/loginAdmin/`, {
        username,
        password,
      })
      .then((res) => {
        if (
          res.status === 200 &&
          res.data.message !== "Wrong UserID/Password"
        ) {
          const token = res.data.token;
          props.setLogin(token);
          sessionStorage.setItem('Address', account);
          console.log(username);
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
                Please provide user-name and password
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel htmlFor="username-input">User Name</InputLabel>
                <Input
                  id="userid-input"
                  value={username}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel htmlFor="password-input">Password</InputLabel>
                <Input
                  id="firstname-input"
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
