import List from "@material-ui/core/List";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import React from "react";

export default function PatientExpandedInfo(props) {
  const { ehr } = props;

  return (
    <React.Fragment>
      <Typography variant="h6">Health Records</Typography>
      <List>
        <ListItemText
          primary={ehr}
          secondary={
            "Edited By " +
            // record.doctorId +
            " on "
            // record.date.toLocaleString()
          }
        />
      </List>
    </React.Fragment>
  );
}
