import { withStyles } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
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
    console.log(props);
    this.state = { isExpanded: false, EHRstate: this.props.EHR };
    this.expand = this.expand.bind(this);
    this.shrink = this.shrink.bind(this);
  }

  expand() {
    this.setState({ isExpanded: true, EHRstate: this.state.EHRstate });
  }

  shrink() {
    this.setState({ isExpanded: false, EHRstate: this.state.EHRstate });
  }

  onEHRChange(PID, e) {
    const EHR = e.target.value;
    this.setState({ isExpanded: this.state.isExpanded, EHRstate: EHR });
    axios
      .post(
        `http://localhost:3001/patient/updateEHR`,
        {
          PID,
          EHR,
        },
        {
          headers: {
            "x-access-token": localStorage.getItem("jwtToken"),
          },
        }
      )
      .then((res) => {
        console.log("Updated Successfully");
      });
  }

  render() {
    const { classes } = this.props;
    return (
      <Card>
        <CardContent>
          <Box mb={1}>
            <Typography color="textSecondary" gutterBottom>
              PID: {this.props.PID}
            </Typography>
            <Typography variant="h5" component="h2">
              {this.props.FirstName} {this.props.LastName}
            </Typography>
            <Typography color="textSecondary">Age: {this.props.Age}</Typography>
            <Typography color="textSecondary">
              Address: {this.props.Address}
            </Typography>
          </Box>
          {this.state.isExpanded ? (
            <div>
              <Typography color="textPrimary">EHR: </Typography>
              <textarea
                placeholder="EHR"
                value={this.state.EHRstate}
                onChange={(e) => this.onEHRChange(this.props.PID, e)}
              ></textarea>
            </div>
          ) : null}
        </CardContent>
        <CardActions>
          {this.state.isExpanded ? (
            <Button size="small" onClick={this.shrink}>
              Shrink
            </Button>
          ) : (
            <Button size="small" onClick={this.expand}>
              Expand
            </Button>
          )}
        </CardActions>
      </Card>
    );
  }
}
export default withStyles(styles, { withTheme: true })(PatientCard);
