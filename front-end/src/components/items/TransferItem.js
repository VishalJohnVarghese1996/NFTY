import { makeStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import React, { useState } from "react";
import Axios from 'axios';

import Web3 from 'web3'
import { TODO_LIST_ABI, TODO_LIST_ADDRESS } from '../../config'

const web3 = new Web3(Web3.givenProvider);
const NftContract = new web3.eth.Contract(TODO_LIST_ABI, TODO_LIST_ADDRESS);

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(4),
  },
}));

export default function TransferItem(props) {  
  const [recieverAddress, setRecieverAddress] = useState("");
  const classes = useStyles();

  const handleTransfer = async (e) => {
    e.preventDefault()

    const accounts = await window.ethereum.enable();
    const account = accounts[0];
    const gas = 7000000;


    const result = await NftContract.methods
    .transferToken(recieverAddress, sessionStorage.getItem("userImage"))
    .send({ from: account, gas });

    const formData = new FormData();
    formData.append('newOwner', recieverAddress); 
    formData.append('action', "transferred");
    formData.append('txHash', result.transactionHash);

    Axios.post(`http://localhost:3001/api/transferToken${sessionStorage.getItem("userImage")}`, formData).then(res => {
      //Now do what you want with the response;
    })

  }


  return (
    <Container maxWidth="sm" component="main" className={"MuiContainer--01"} id="container">
      <Paper className={classes.paper}>
        <form>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography
                component="h1"
                variant="h5"
                align="center"
                color="textPrimary"
                gutterBottom
              >
                Please provide address of the reciever
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Reciever address</InputLabel>
                <Input
                  id="userid-input"
                  // value={userid}
                  onChange={(e) => setRecieverAddress(e.target.value)}
                  required
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                className={"MuiButton-Full"}
                variant="contained"
                size="large"
                color="primary"
                onClick={handleTransfer}
              >
                Transfer
              </Button>
            </Grid>
            <Grid item xs={12}>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}
