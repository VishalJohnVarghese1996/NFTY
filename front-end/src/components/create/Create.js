import { makeStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Axios from 'axios';
import React, { useState, useEffect } from "react";
import { useForm } from 'react-hook-form';
// import sessionStorage from '/home/vishal/BITS Pilani/Sem2/NS/Project/Work/Work/NFTY/front-end/src/components/login/LoginAdmin.js';
// import UserProfile from '../login/SessionDetails';

import Web3 from 'web3'
import { TODO_LIST_ABI, TODO_LIST_ADDRESS } from '../../config'

const web3 = new Web3(Web3.givenProvider);
const NftContract = new web3.eth.Contract(TODO_LIST_ABI, TODO_LIST_ADDRESS);


const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(4),
  },
}));

export default function CreatePage(props) {
  const [selectedFile, setSelectedFile] = useState();
  const [isSelected, setIsSelected] = useState(false);

  // baseuri
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [copiesCount, setCopiesCount] = useState("");
  const [royalties, setRoyalties] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  // const [tokenArray, setTokenArray] = useState([]);

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsSelected(true);
  };

  const classes = useStyles();

  // useEffect(() => {
  //   console.log("====");
  // })

  const { register, handleSubmit } = useForm()

  const onSubmit = async (data, event) => {

    event.preventDefault();

    const accounts = await window.ethereum.enable();
    const account = accounts[0];


    // const gas = await HelloContract.methods.sendBal('0x9c9e37934CC8Dd832E8C2406324Dd04D5CdE715f').estimateGas();

    const gas = 7000000;


    // , value:web3.utils.toWei("0.5", "ether")

    var baseURI = '{'
      + '"title" : ' + title + ','
      + '"description"  : ' + description + ','
      + '"price" : ' + price + ','
      + '"copiesCount" : ' + copiesCount + ','
      + '"royalties" : ' + royalties
      + '}';

      const result = await NftContract.methods
      .mintNft(baseURI, copiesCount, price, royalties)
      .send({ from: account, gas });

      console.log(result.transactionHash)


      var tokenArray = new Array(result.events.Transfer.length);
      var i;
      for (i = 0; i < result.events.Transfer.length; i++) {
        console.log(result.events.Transfer[i].returnValues.tokenId);
        tokenArray[i] = result.events.Transfer[i].returnValues.tokenId;
      }


    setImage(data.pic[0]);

    const formData = new FormData();
    formData.append('file', data.pic[0]);
    formData.append('title', title); 
    // formData.append('description', description); 
    formData.append('price', price); 
    // formData.append('copiesCount', copiesCount); 
    // formData.append('royalties', royalties); 
    formData.append('owner', account);
    formData.append('action', "minted");
    formData.append('txHash',result.transactionHash);
    formData.append('tokenArray', JSON.stringify(tokenArray));
  

    Axios.post("http://localhost:3001/api/createTokenImage", formData).then(res => {
      //Now do what you want with the response;
    })
  }

  return (
    <Container maxWidth="sm" component="main" className={"MuiContainer--01"}>
      <Paper className={classes.paper}>
        {/* <form onSubmit={handleSubmit}> */}
        <form onSubmit={handleSubmit(onSubmit)}>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography
                component="h1"
                variant="h3"
                align="center"
                color="textPrimary"
                gutterBottom
              >
                Create and Mint NFT
                        </Typography>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel htmlFor="title-input">Title</InputLabel>
                <Input
                  id="title-input"
                  // value={title}
                  name="title"
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel htmlFor="description-input">Description</InputLabel>
                <Input
                  id="description-input"
                  // value={description}
                  name="description"
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel htmlFor="price-input">Price</InputLabel>
                <Input
                  id="price-input"
                  name="price"
                  onChange={(e) => setPrice(e.target.value)}
                  // value={price}
                  required
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel htmlFor="copies-count-input">Number of Copies</InputLabel>
                <Input
                  id="copies-count-input"
                  // value={copiesCount}
                  name="copiesCount"
                  onChange={(e) => setCopiesCount(e.target.value)}
                  type="text"
                  required
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel htmlFor="royalties-input">
                  Royalties(%)
                          </InputLabel>
                <Input
                  id="royalties-input"
                  // value={royalties}
                  name="royalties"
                  onChange={(e) => setRoyalties(e.target.value)}
                  type="text"
                  required
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              {/* <form runat="server"> */}
              <input
                // ref={register}
                {...register('pic')}
                type="file"
                id="pic"
                // name="pic"
              // onChange={(e) => setImage(e.target.files[0])}
              // onChange={sayhey}
              />

              {isSelected ? (
                <div>
                  <p>Filename: {selectedFile.name}</p>
                  <p>Filetype: {selectedFile.type}</p>
                  <p>Size in bytes: {selectedFile.size}</p>
                </div>
              ) : (
                <p>Select a file to show details</p>
              )}
              {/* </form> */}
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                className={"MuiButton-Full"}
                variant="contained"
                size="large"
                color="primary"
              // onClick={sendtoBlockchain}
              >
                Create Token
                        </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}