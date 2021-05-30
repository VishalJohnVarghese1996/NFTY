import { withStyles } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import Paper from "@material-ui/core/Paper";
import SearchIcon from "@material-ui/icons/Search";
import React from "react";

const styles = (theme) => ({
  root: {
    margin: theme.spacing(1),
    padding: theme.spacing(0.5),
    display: "flex",
    alignItems: "center",
    minWidth: 275,
  },
  input: {
    marginLeft: 8,
    flex: 1,
  },
});

class SearchBoxPatients extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = { filter: "" };
  }

  handleChange(e) {
    this.props.onFilterChange(e.target.value);
  }

  render() {
    const { classes } = this.props;
    const filter = this.props.inputValue;

    return (
      <Paper className={classes.root}>
        <InputBase
          className={classes.input}
          placeholder="Filter Patients"
          value={filter}
          inputProps={{ "aria-label": "filter patients" }}
          onChange={this.handleChange}
        />
        <IconButton aria-label="search">
          <SearchIcon />
        </IconButton>
      </Paper>
    );
  }
}
export default withStyles(styles, { withTheme: true })(SearchBoxPatients);
