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
import React, { useState, useEffect } from "react";
import { openSnackBar } from "../snackBar/SnackBar";
import sessionStorage from '/home/vishal/BITS Pilani/Sem2/NS/Project/Work/Work/NFTY/front-end/src/components/login/LoginAdmin.js';
import UserProfile from '../login/SessionDetails';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(4),
  },
}));

export default function CreatePage(props) {
  const [selectedFile, setSelectedFile] = useState();
	const [isSelected, setIsSelected] = useState(false);

  const changeHandler = (event) => {
		setSelectedFile(event.target.files[0]);
		setIsSelected(true);
	};

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [copiesCount, setCopiesCount] = useState("");
  const [royalties, setRoyalties] = useState("");
  const [image, setImage] = useState(null);
  var userName = UserProfile.getName();
  var date = Date().toLocaleString()
  console.log(date);
  const validateForm = () => {
    let errors = [];
    if (title == "" || description == "" || price == "" || copiesCount == "" || royalties == "") {
      errors.push("Please fill all the fields");
      console.log("Please fill all the fields");
    }
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (errors.length) {
      errors.forEach((error) => {
        openSnackBar({ message: error, type: "error" });
      });
    } else {
      axios
        .post(`http://localhost:3001/createTokenImage`, {
          title,
          userName,
          description,
          price,
          copiesCount,
          royalties,
          selectedFile,
          date
        })
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            openSnackBar({ message: res.data.message, type: "success" });
            props.history.push("/login");
            return;
          } else {
            openSnackBar({ message: "Authentication Error", type: "error" });
          }
        })
        .catch((error) => {
          console.log(error);
          openSnackBar({ message: "errorss", type: "error" });
        });
    }
  };


  // const createPage = () => {
  //   const [title, setTitle] = useState("");
  //   const [description, setDescription] = useState("");
  //   const [price, setPrice] = useState("");
  //   const [count, setCount] = useState("");
  //   const [royalties, setRoyalties] = useState("");

    const classes = useStyles();

    return (
      <Container maxWidth="sm" component="main" className={"MuiContainer--01"}>
        <Paper className={classes.paper}>
          <form onSubmit={handleSubmit}>
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
                    value={title}
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
                    value={description}
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
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel htmlFor="copies-count-input">Number of Copies</InputLabel>
                  <Input
                    id="copies-count-input"
                    value={copiesCount}
                    type="text"
                    onChange={(e) => setCopiesCount(e.target.value)}
                    required
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel htmlFor="royalties-input">
                    Royalties
                          </InputLabel>
                  <Input
                    id="royalties-input"
                    value={royalties}
                    type="password"
                    onChange={(e) => setRoyalties(e.target.value)}
                    required
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                {/* <form runat="server"> */}
                  <input name="file" accept="image/*" type='file' id="imgInp" required onChange = {changeHandler} />
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