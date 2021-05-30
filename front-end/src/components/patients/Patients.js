import { Container } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Grid from '@material-ui/core/Grid';
import { withStyles } from "@material-ui/styles";
import axios from "axios";
import React from "react";

import Create from '../create/Create'
import Buy from '../buy/Buy'
import Transfer from '../transfer/Transfer'
import Items from '../items/Items'
import { useHistory } from 'react-router'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";


const styles = (theme) => ({
  box: {
    margin: theme.spacing(1),
  },
});


class Patients extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      addingPatient: 0,
    }
    this.sayHello = this.sayHello.bind(this);
  }

  sayHello(val) {
    this.setState({ addingPatient: val });
    alert(this.state.addingPatient);

  }



  render() {
    

    console.log(sessionStorage.getItem('UserId'))
    return (
      <Router path="/patients">


        <Grid
          container
          spacing={0}
          direction="row"
        >


        

          <Link to="/create">
            <Button
              type="submit"
              className={"MuiButton-Full"}
              variant="contained"
              size="large"
              color="primary"
              style={{ margin: '15px 15px 15px 100px', height: '70px', width: '400px', fontSize: '30px' }}
            >Create Token
      </Button>

          </Link>


          <Link to="/buy">
            <Button
              type="submit"
              className={"MuiButton-Full"}
              variant="contained"
              size="large"
              color="primary"
              style={{ margin: '15px', height: '70px', width: '400px', fontSize: '30px' }}
            >Buy Token
      </Button>
          </Link>



          <Link to="/transfer">
            <Button
              type="submit"
              className={"MuiButton-Full"}
              variant="contained"
              size="large"
              color="primary"
              style={{ margin: '15px', height: '70px', width: '400px', fontSize: '30px' }}
            >Transfer Token
      </Button>
          </Link>

          <Link to="/items">
            <Button
              type="submit"
              className={"MuiButton-Full"}
              variant="contained"
              size="large"
              color="primary"
              style={{ margin: '15px', height: '70px', width: '400px', fontSize: '30px' }}
            >My Items
            </Button>
          </Link>

          <Switch>
            <Route path="/create">
              <Create />
            </Route>
            <Route path="/buy">
              <Buy />
            </Route>
            <Route path="/transfer">
              <Transfer />
            </Route>
            <Route path="/items">
              <Items />
            </Route>
          </Switch>
        </Grid>

      </Router>


    );

  }

}

export default withStyles(styles, { withTheme: true })(Patients);