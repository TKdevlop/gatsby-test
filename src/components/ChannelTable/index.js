import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";

import Snackbar from "@material-ui/core/Snackbar";

import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import "./app.css";
import Fab from "@material-ui/core/Fab";
import NavigationIcon from "@material-ui/icons/CloudUpload";
import { lighten } from "@material-ui/core/styles/colorManipulator";
import TextField from "@material-ui/core/TextField";
import Chip from "@material-ui/core/Chip";
import FaceIcon from "@material-ui/icons/Face";
import DoneIcon from "@material-ui/icons/Done";
let counter = 0;
function createData(name, price, type, carbs, protein) {
  counter += 1;
  return { id: counter, name, price, type, carbs, protein };
}

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === "desc"
    ? (a, b) => desc(a, b, orderBy)
    : (a, b) => -desc(a, b, orderBy);
}

const rows = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Name"
  },
  { id: "price", numeric: true, disablePadding: false, label: "Price" },
  {
    id: "type",
    numeric: true,
    disablePadding: false,
    label: "Type (channel/pack)"
  }
];

class EnhancedTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const {
      onSelectAllClick,
      order,
      orderBy,
      numSelected,
      rowCount
    } = this.props;

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount}
              onChange={onSelectAllClick}
            />
          </TableCell>
          {rows.map(
            row => (
              <TableCell
                key={row.id}
                align={row.numeric ? "right" : "left"}
                padding={row.disablePadding ? "none" : "default"}
                sortDirection={orderBy === row.id ? order : false}
              >
                <Tooltip
                  title="Sort"
                  placement={row.numeric ? "bottom-end" : "bottom-start"}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === row.id}
                    direction={order}
                    onClick={this.createSortHandler(row.id)}
                  >
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            ),
            this
          )}
        </TableRow>
      </TableHead>
    );
  }
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
};

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85)
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark
        },
  spacer: {
    flex: "1 1 100%"
  },
  actions: {
    color: theme.palette.text.secondary
  },
  title: {
    flex: "0 0 auto"
  }
});

let EnhancedTableToolbar = props => {
  const { numSelected, classes } = props;

  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: numSelected > 0
      })}
    >
      <div className={classes.title}>
        {numSelected > 0 ? (
          <Typography color="inherit" variant="subtitle1">
            {numSelected} selected
          </Typography>
        ) : (
          <Typography variant="h6" id="tableTitle">
            Channel Table
          </Typography>
        )}
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton aria-label="Delete">
              <DeleteIcon onClick={props.resetData} />
            </IconButton>
          </Tooltip>
        ) : null}
      </div>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired
};

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3
  },
  table: {
    minWidth: 0
  },
  tableWrapper: {
    overflowX: "auto"
  }
});

class EnhancedTable extends React.Component {
  componentDidMount() {
    fetch("https://rahul-cabel-netwrok.firebaseio.com/channels.json")
      .then(res => res.json())
      .then(data => {
        const channelData = [];
        for (let i = 0; i < data.length; i++) {
          channelData.push(
            createData(data[i].name, data[i].charge, data[i].type)
          );
        }
        this.setState({ data: channelData });
        this.setState({
          selectedData: [
            { id: 3, name: "BASIC SERVICE TIER", price: "130.00", type: "Pack" }
          ]
        });
        this.setState({ selected: [3], total: 130 });
      });
  }
  state = {
    order: "",
    orderBy: "",
    selected: [],
    data: [],
    selectedData: [],
    page: 0,
    name: "",
    vcNo: "",
    phoneNo: "",
    rowsPerPage: 20,
    open: false,
    text: "",
    disabled: false,
    total: 0
  };
  handleSubmit = () => {
    if (
      this.state.name !== "" &&
      this.state.vcNo !== "" &&
      this.state.phoneNo.length >= 10
    ) {
      this.setState({ disabled: true });
      fetch("https://rahul-cabel-netwrok.firebaseio.com/users.json", {
        method: "POST",
        body: JSON.stringify({
          name: this.state.name,
          vcNo: this.state.vcNo,
          phoneNo: this.state.phoneNo,
          channels: this.state.selectedData
        })
      })
        .then(res => res.json())
        .then(data => {
          console.log(data);
          this.setState({
            text: "DATA SUCCESSFULLY SUBMITTED!",
            open: true,
            disabled: false
          });
        });

      return;
    }
    this.setState({
      text: "FILL ALL TEXT FIELDS BEFORE SUBMITTING THE DATA!",
      open: true
    });
  };
  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = "desc";

    if (this.state.orderBy === property && this.state.order === "desc") {
      order = "asc";
    }

    this.setState({ order, orderBy });
  };

  handleSelectAllClick = event => {
    if (event.target.checked) {
      this.setState(state => ({ selected: state.data.map(n => n.id) }));
      this.setState(state => ({ selectedData: state.data.map(n => n) }));
      this.setState(state => {
        let total = 0;
        state.data.forEach(d => {
          total += parseFloat(d.price);
        });
        return { total };
      });
      return;
    }
    this.setState({ selected: [] });
    this.setState({ selectedData: [] });
    this.setState({ total: 0 });
  };

  handleClick = (event, id) => {
    const { selected, data } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    const selectedData = [];
    newSelected.forEach(select => {
      data.forEach(se => {
        if (select === se.id) {
          selectedData.push(se);
        }
      });
    });
    let total = 0;
    selectedData.forEach(d => {
      total += parseFloat(d.price);
    });
    this.setState({ total });
    this.setState({ selectedData });
    this.setState({ selected: newSelected });
  };
  resetData = () => {
    this.setState({ selected: [] });
    this.setState({ selectedData: [] });
    this.setState({ total: 0 });
  };
  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };
  changeHandler = ({ target: { name, value } }) => {
    this.setState({ [name]: value });
  };
  handleClose = () => {
    this.setState({ open: false });
  };
  isSelected = id => this.state.selected.indexOf(id) !== -1;

  render() {
    const { classes } = this.props;
    const { data, order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows =
      rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    return (
      <>
        <div style={{ maxWidth: "95vw", textAlign: "center" }}>
          <TextField
            id="standard-full-width"
            label="Name*"
            onChange={this.changeHandler}
            name="name"
            style={{ margin: 12 }}
            placeholder="Your Name"
            helperText="Enter your name"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true
            }}
          />
          <TextField
            id="standard-full-width"
            label="VC Number*"
            onChange={this.changeHandler}
            name="vcNo"
            style={{ margin: 12 }}
            placeholder="Your VC Number"
            helperText="Enter your setup-box VC number"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true
            }}
          />
          <TextField
            id="standard-full-width"
            label="Mobile Number*"
            onChange={this.changeHandler}
            name="phoneNo"
            style={{ margin: 12 }}
            placeholder="Your mobile number"
            helperText="Enter your mobile number"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true
            }}
          />
        </div>
        <Paper className={classes.root}>
          <EnhancedTableToolbar
            resetData={this.resetData}
            numSelected={selected.length}
          />
          <div style={{ textAlign: "center" }} className={classes.tableWrapper}>
            <Table className="table" aria-labelledby="tableTitle">
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={this.handleSelectAllClick}
                onRequestSort={this.handleRequestSort}
                rowCount={data.length}
              />
              <TableBody>
                {stableSort(data, getSorting(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(n => {
                    const isSelected = this.isSelected(n.id);
                    return (
                      <TableRow
                        hover
                        onClick={event => this.handleClick(event, n.id)}
                        role="checkbox"
                        aria-checked={isSelected}
                        tabIndex={-1}
                        key={n.id}
                        selected={isSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox checked={isSelected} />
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          {n.name}
                        </TableCell>
                        <TableCell align="right">{n.price}</TableCell>
                        <TableCell align="right">{n.type}</TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 49 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            backIconButtonProps={{
              "aria-label": "Previous Page"
            }}
            nextIconButtonProps={{
              "aria-label": "Next Page"
            }}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
        </Paper>
        <div>
          <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left"
            }}
            open={this.state.open}
            autoHideDuration={3000}
            onClose={this.handleClose}
            ContentProps={{
              "aria-describedby": "message-id"
            }}
            message={<span id="message-id">{this.state.text}</span>}
            action={[
              <IconButton
                key="close"
                aria-label="Close"
                color="inherit"
                className={classes.close}
                onClick={this.handleClose}
              />
            ]}
          />
          <div style={{ margin: 20, textAlign: "right" }}>
            <Chip
              label="TOTAL (exclude GST)"
              clickable
              className={classes.chip}
              color="primary"
            />
            &nbsp;{this.state.total.toFixed(2)} Rs.
            <br />
            <br />
            <Fab
              disabled={this.state.disabled}
              variant="extended"
              color="primary"
              onClick={this.handleSubmit}
              style={{ cursor: "pointer" }}
              aria-label="Add"
              className={classes.margin}
            >
              <NavigationIcon
                style={{ padding: 10 }}
                className={classes.extendedIcon}
              />
              SUBMIT
            </Fab>
          </div>
          <div className="footer">
            Contact Us for any query at <strong>+919412347346</strong>,{" "}
            <strong>+918667408870</strong>
          </div>
        </div>
      </>
    );
  }
}

EnhancedTable.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(EnhancedTable);
