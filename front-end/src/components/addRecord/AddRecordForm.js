import { FormControl, Input, InputLabel } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import axios from "axios";
import React, { useState } from "react";
import { openSnackBar } from "../snackBar/SnackBar";

const styles = {
  formDiv: {
    marginLeft: 10,
    marginRight: 10,
  },
  textField: {
    marginLeft: 8,
    marginRight: 10,
    width: 300,
  },
};

export default function AddRecordForm(props) {
  const [information, setInformation] = useState("");

  const handleChange = (e) => {
    setInformation(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(
        `http://localhost:3001/records/`,
        {
          key: props.PId,
          information,
          doctorId: "asdasd",
        },
        {
          headers: {
            "x-access-token": localStorage.getItem("jwtToken"),
          },
        }
      )
      .then((res) => {
        openSnackBar({
          message: "Record Added Successfully",
          type: "success",
        });
      })
      .catch((error) => {
        openSnackBar({ message: error.response.data.message, type: "error" });
      })
      .finally(() => {
        props.handleExit();
      });
  };

  return (
    <div style={styles.formDiv}>
      <form onSubmit={handleSubmit}>
        <FormControl margin="normal" fullWidth required>
          <InputLabel htmlFor="msg">Add New Record</InputLabel>
          <Input
            id="msg"
            value={information}
            onChange={handleChange}
            multiline
            rows={10}
            required
          />
        </FormControl>
        <Button type="submit" size="small" variant="outlined" color="primary">
          Submit
        </Button>
      </form>
    </div>
  );
}
