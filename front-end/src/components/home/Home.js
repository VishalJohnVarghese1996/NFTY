import { Container } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import React from "react";

export default function Home() {
  return (
    <Container maxWidth="sm" component="main" className={"MuiContainer--01"}>
      <Typography
        component="h1"
        variant="h2"
        align="center"
        color="textPrimary"
        gutterBottom
      >
        EHRecords
      </Typography>
      <Typography
        variant="h5"
        align="center"
        color="textSecondary"
        component="p"
      >
        Using Hyperledger to store patients' sensitive data securely and provide
        a hassle free transfer of data
      </Typography>
    </Container>
  );
}
