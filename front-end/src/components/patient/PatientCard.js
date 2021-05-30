import { withStyles } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import React from "react";

const styles = (theme) => ({
  card: {
    minWidth: 275,
    margin: theme.spacing(1),
  },
});

class PatientCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isExpanded: false };
    this.expand = this.expand.bind(this);
    this.shrink = this.shrink.bind(this);
  }

  expand() {
    this.setState({ isExpanded: true });
  }

  shrink() {
    this.setState({ isExpanded: false });
  }

  removePatient() {
    let PID = this.props.PID;
    axios
      .post(
        `http://localhost:3001/patient/remove`,
        {
          PID,
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
  }

  render() {
    const { classes } = this.props;
    const pid = this.props.PID;
    return (
      <Card className={classes.card}>
        <CardContent>
          <Box mb={1}>
            <Typography color="textSecondary" gutterBottom>
              PID {this.props.PID}
            </Typography>
            <Typography variant="h5" component="h2">
              {this.props.FirstName} {this.props.LastName}
            </Typography>
            <Typography color="textSecondary">Age: {this.props.Age}</Typography>
            <Typography color="textSecondary">
              Address: {this.props.Address}
            </Typography>
          </Box>
        </CardContent>
        <Button
          onClick={() => {
            axios.post(
              `http://localhost:3001/patient/remove`,
              {
                pid,
              },
              {
                headers: {
                  "x-access-token": localStorage.getItem("jwtToken"),
                },
              }
            );
          }}
        >
          Remove
        </Button>
      </Card>
    );
  }
}
export default withStyles(styles, { withTheme: true })(PatientCard);
