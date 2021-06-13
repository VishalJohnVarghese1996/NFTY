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
      createDown: false,
      buyDown: false,
      itemsDown: false,
    }
    this.sayHello = this.sayHello.bind(this);
    this.sayBuy = this.sayBuy.bind(this);
    this.sayItems = this.sayItems.bind(this);
    sessionStorage.setItem('patientsOn', true);
  }


  sayHello() {
    this.setState({ buyDown: false });
    this.setState({ itemsDown: false });
    this.setState({ createDown: !this.state.createDown });
  }

  sayBuy() {
    this.setState({ createDown: false });
    this.setState({ itemsDown: false });
    this.setState({ buyDown: !this.state.buyDown });
    // alert(this.state.buyDown);
  }

  sayItems() {
    this.setState({ createDown: false });
    this.setState({ buyDown: false });
    this.setState({ itemsDown: !this.state.itemsDown });
    // alert(this.state.buyDown);
  }



  render() {

    // console.log(sessionStorage.getItem('UserId'))
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
              onClick={this.sayHello}
              style={{ fontFamily: 'Patrick Hand SC', margin: '15px 20px 20px 145px', height: '70px', width: '500px', fontSize: '30px' }}
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
              onClick={this.sayBuy}
              style={{ fontFamily: 'Patrick Hand SC', margin: '15px', height: '70px', width: '500px', fontSize: '30px' }}
            >Buy Token
            </Button>
          </Link>

          <Link to="/items">
            <Button
              type="submit"
              className={"MuiButton-Full"}
              variant="contained"
              size="large"
              color="primary"
              onClick={this.sayItems}
              style={{ fontFamily: 'Patrick Hand SC', margin: '15px', height: '70px', width: '500px', fontSize: '30px' }}
            >My Items
            </Button>
          </Link>

          <Switch>
            <Route path="/create">
              {this.state.createDown ? (
                <Create />
              ) : (
                null
              )}
            </Route>
            <Route path="/buy">
              {this.state.buyDown ? (
                <Buy />
              ) : (
                null
              )}
            </Route>
            <Route path="/items">
              {this.state.itemsDown ? (
                <Items />
              ) : (
                null
              )}
            </Route>
          </Switch>
        </Grid>

      </Router>


    );

  }

}

export default withStyles(styles, { withTheme: true })(Patients);