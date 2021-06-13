import { Container } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import React from "react";

export default function AboutUs() {
  return (
    <Container maxWidth="sm" component="main" className={"MuiContainer--01"}>
      <Typography
        component="h1"
        variant="h2"
        align="center"
        color="textPrimary"
        gutterBottom
      >
        About Us
      </Typography>
      <Typography
        color="textPrimary"
        component="h3"
        variant="h5"
        align="center"
        gutterBottom
      >
        BITS PILANI
      </Typography>

      <Typography color="textSecondary"  color="textPrimary" component="h3" variant="h5" align="justify">
        We are a team of passionate engineers who are looking forward to
        address one of the most discussed problem in the world of digital art.
        We believe in technology and we aim to  build simple and precise application.
        Our platform NFTY focuses on digital art management which gives its
        users a transparent platform to buy, transfer and sell the digital
        arts. We have selected the most suitable technology which is
        blockchain to address this particular issue. Blockchain can
        eliminate the known issues which are present in the digital art
        world right now. We focus on Transparency and simplicity.
      </Typography>
    </Container>
  );
}
