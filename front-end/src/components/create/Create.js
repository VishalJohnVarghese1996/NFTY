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

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(4),
  },
}));


const CreatePage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [count, setCount] = useState("");
  const [royalties, setRoyalties] = useState("");

  const classes = useStyles();

  return (
    <Container maxWidth="sm" component="main" className={"MuiContainer--01"}>
      <Paper className={classes.paper}>
        <form >
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
                <InputLabel htmlFor="username-input">Title</InputLabel>
                <Input
                  id="username-input"
                  value={royalties}
                  onChange={(e) => setRoyalties(e.target.value)}
                  required
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel htmlFor="username-input">Description</InputLabel>
                <Input
                  id="username-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel htmlFor="username-input">Price</InputLabel>
                <Input
                  id="userid-input"
                  value={count}
                  onChange={(e) => setCount(e.target.value)}
                  required
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel htmlFor="newpassword-input">Number of Copies</InputLabel>
                <Input
                  id="newpassword-input"
                  value={description}
                  type="text"
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel htmlFor="newpassword-confirmation-input">
                  Royalties
                        </InputLabel>
                <Input
                  id="newpassword-confirmation-input"
                  value={price}
                  type="password"
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <form runat="server">
                <input accept="image/*" type='file' id="imgInp" />
              </form>
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
};

export default CreatePage;