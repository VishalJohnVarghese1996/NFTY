import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/styles";
import axios from "axios";
import React, { useState } from "react";
import { openSnackBar } from "../snackBar/SnackBar";

// const cryptoRandomString = require("crypto-random-string");
const useStyles = makeStyles((theme) => ({
  card: {
    minWidth: 275,
    margin: theme.spacing(1),
    padding: theme.spacing(1),
  },
}));

export default function AddPatientForm(props) {
  const [pid, setPid] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [age, setAge] = useState("");
  const cancel = props.cancel;
  const password = "password";

  const addPatient = props.addPatient;

  const classes = useStyles();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(
        `http://localhost:3001/patient/add`,
        {
          pid,
          firstName,
          lastName,
          address,
          age,
          password,
        },
        {
          headers: {
            "x-access-token": localStorage.getItem("jwtToken"),
          },
        }
      )
      .then((res) => {
        openSnackBar({
          message: "Patient data added successfully",
          type: "success",
        });
        addPatient(res.data.newPatient);
      })
      .catch((error) => {
        openSnackBar({ message: error.response.data.message, type: "error" });
      });
  };

  return (
    <React.Fragment>
      <Card className={classes.card}>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <Typography variant="h6" component="h2">
              New Patient
            </Typography>
            <Box m={1}>
              <Grid container spacing={2}>
                <Grid item sm={12}>
                  <FormControl fullWidth required>
                    <InputLabel htmlFor="pid-input">PID</InputLabel>
                    <Input
                      id="pid-input"
                      value={pid}
                      onChange={(e) => setPid(e.target.value)}
                      required
                    />
                  </FormControl>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel htmlFor="firstname-input">
                      First Name
                    </InputLabel>
                    <Input
                      id="firstname-input"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </FormControl>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel htmlFor="lastname-input">Last Name</InputLabel>
                    <Input
                      id="lastname-input"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </FormControl>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel htmlFor="address-input">Address</InputLabel>
                    <Input
                      id="address-input"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                  </FormControl>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel htmlFor="age-input">Age</InputLabel>
                    <Input
                      id="age-input"
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      required
                      inputProps={{ min: 0 }}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
          <CardActions>
            <Box className={"MuiBox-RightAlign"}>
              <Button color="secondary" onClick={cancel}>
                Cancel
              </Button>
              <Button type="submit" color="primary">
                Save
              </Button>
            </Box>
          </CardActions>
        </form>
      </Card>
    </React.Fragment>
  );
}
