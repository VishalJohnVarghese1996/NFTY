import { Container } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Grid from '@material-ui/core/Grid';
import { withStyles } from "@material-ui/styles";
import axios from "axios";
import React from "react";


// import history from './history';

// import Create from '../create/Create';
import { BrowserRouter as Router, Route, Switch, Link, Redirect, useHistory } from "react-router-dom";

// import CreatePage from './Create';


const styles = (theme) => ({
  box: {
    margin: theme.spacing(1),
  },
});

class Patients extends React.Component {

  nextPath(path) {
    this.props.history.push(path);
    
  }



  render() {

    return (

      // <Router>

      //   <Route path="/" component={CreatePage}/>

      // </Router>

      <button onClick={() => this.nextPath('/login/doctor')}>
        change path
      </button>
      





      // </div>
    );
  }
}
export default withStyles(styles, { withTheme: true })(Patients);



// <div>

{/* <Grid
container
spacing={0}
direction="column"
alignItems="center"
justify="center"
style={{ minHeight: '100vh' }}
>

<Grid item xs={3}>


  <a href="/create">
    <Button
      type="submit"
      className={"MuiButton-Full"}
      variant="contained"
      size="large"
      color="primary"
      style={{ margin: '15px', height: '70px', width: '500px', fontSize: '30px' }}
    >Create Token
  </Button>
  </a>


  <a href="/buy">
    <Button
      type="submit"
      className={"MuiButton-Full"}
      variant="contained"
      size="large"
      color="primary"
      style={{ margin: '15px', height: '70px', width: '500px', fontSize: '30px' }}
    >Buy Token
  </Button>
  </a>



  <a href="/transfer">
    <Button
      type="submit"
      className={"MuiButton-Full"}
      variant="contained"
      size="large"
      color="primary"
      style={{ margin: '15px', height: '70px', width: '500px', fontSize: '30px' }}
    >Transfer Token
  </Button>
  </a>

  <a href="/items">
    <Button
      type="submit"
      className={"MuiButton-Full"}
      variant="contained"
      size="large"
      color="primary"
      style={{ margin: '15px', height: '70px', width: '500px', fontSize: '30px' }}
    >My Items
  </Button>
  </a>

</Grid>

</Grid> */}