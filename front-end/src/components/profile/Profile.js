import { Container } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Grid from '@material-ui/core/Grid';
import { withStyles } from "@material-ui/styles";
import axios from "axios";
import React from "react";
import AddDoctorForm from "../addDoctor/AddDoctorForm";
import AddPatientForm from "../addPatient/AddPatientForm";
import DoctorList from "../doctorList/DoctorList";
import PatientList from "../patientList/PatientList";
import SearchBoxPatients from "../searchBoxPatients/SearchBoxPatients";
import { openSnackBar } from "../snackBar/SnackBar";

const styles = (theme) => ({
  box: {
    margin: theme.spacing(1),
  },
});

class Profile extends React.Component {

  render() {


    return (
      <div class="card" style={{margin: '100px 15px 160px 750px', alignSelf: 'center'}}>
          <div class="card-image">
              {/* <img src={'http://localhost:3001/img/' + val.userid} alt="hey" id="img" onClick={() => handleEvent(1, val.userid)}> */}
              {/* </img> */}
          </div>
          <div >
            <div class="card-text" >
                <span class="date" >Name : </span>
                {/* <h2>Owner : {val.user_name}</h2>
                <h2>Price : {val.price} eth</h2> */}
            </div>
            <div class="card-text">
              <span class="date">User Name : </span>
              {/* <h2>Owner : {val.user_name}</h2>
              <h2>Price : {val.price} eth</h2> */}
            </div>
            <div class="card-text">
                <span class="date">Email : </span>
                {/* <h2>Owner : {val.user_name}</h2>
                <h2>Price : {val.price} eth</h2> */}
            </div>
          </div>
          

      </div>
  )



    // return (

    //   // <div>

    //   <Grid
    //     container
    //     spacing={0}
    //     direction="column"
    //     alignItems="center"
    //     justify="center"
    //     style={{ minHeight: '100vh' }}
    //   >

    //     <Grid item xs={3}>

    //       <a href="/">
    //         <Button
    //           type="submit"
    //           className={"MuiButton-Full"}
    //           variant="contained"
    //           size="large"
    //           color="primary"
    //           style={{ margin: '15px', height: '70px', width: '500px', fontSize: '30px' }}
    //         >Create Token
    //       </Button>
    //       </a>


    //       <a href="/buy">
    //         <Button
    //           type="submit"
    //           className={"MuiButton-Full"}
    //           variant="contained"
    //           size="large"
    //           color="primary"
    //           style={{ margin: '15px', height: '70px', width: '500px', fontSize: '30px' }}
    //         >Buy Token
    //       </Button>
    //       </a>

    //       <a href="/transfer">
    //         <Button
    //           type="submit"
    //           className={"MuiButton-Full"}
    //           variant="contained"
    //           size="large"
    //           color="primary"
    //           style={{ margin: '15px', height: '70px', width: '500px', fontSize: '30px' }}
    //         >Transfer Token
    //       </Button>
    //       </a>

    //       <a href="/items">
    //         <Button
    //           type="submit"
    //           className={"MuiButton-Full"}
    //           variant="contained"
    //           size="large"
    //           color="primary"
    //           style={{ margin: '15px', height: '70px', width: '500px', fontSize: '30px' }}
    //         >My Items
    //       </Button>
    //       </a>

    //     </Grid>

    //   </Grid>
    //   // </div>
    // );
  }
}
export default Profile;
