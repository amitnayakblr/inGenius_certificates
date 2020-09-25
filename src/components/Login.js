import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { loginUser } from "../actions";
import { withStyles } from "@material-ui/styles";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import Link from '@material-ui/core/Link';


const styles = () => ({
  "@global": {
    body: {
      backgroundColor: "#fff"
    }
  },
  paper: {
    marginTop: 100,
    display: "flex",
    padding: 20,
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    marginLeft: "auto",
    marginRight: "auto",
    backgroundColor: "#f50057"
  },
  form: {
    marginTop: 1
  },
  errorText: {
    color: "#f50057",
    marginBottom: 5,
    textAlign: "center"
  }
});

class Login extends Component {
  state = { email: "", submitted: false };

  handleEmailChange = ({ target }) => {
    this.setState({ email: target.value });
  };

  handleSubmit = () => {
    const { dispatch } = this.props;
    const { email } = this.state;
    this.setState({submitted: true});

    dispatch(loginUser(email));
  };

  render() {
    const { classes, isAuthenticated } = this.props;
    if (isAuthenticated) {
      return <Redirect to="/" />;
    } else {
      return (
        <Container component="main" maxWidth="xs">
          <Paper className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>

            {this.state.submitted && (
              <Typography component="p" className={classes.errorText}>
                Check your mail for Sign in link.
              </Typography>
            )}

            { !this.state.submitted && (
              <abc>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  onChange={this.handleEmailChange}
                />
                <Button
                  type="button"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  onClick={this.handleSubmit}
                >
                  Sign In
                </Button>
              </abc>
            )}

            <br></br>
            <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
                <Link color="primary" href="/verify">
                    Verify Certificate
                </Link>
            </Typography>
          </Paper>
          <br></br>
          <br></br>
          <br></br>
          {/* Footer */}
          <footer className={classes.footer}>
            <Typography variant="h6" align="center" gutterBottom>
              With <span role="img" aria-label="heart">❤️</span> from inGenius
            </Typography>
            <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
              <Link color="inherit" href="https://dscnsec.com"> {/*change link*/}
                Explore inGenius
              </Link>
            </Typography>
          </footer>
          {/* End footer */}
        </Container>
      );
    }
  }
}

function mapStateToProps(state) {
  return {
    isLoggingIn: state.auth.isLoggingIn,
    loginError: state.auth.loginError,
    isAuthenticated: state.auth.isAuthenticated
  };
}

export default withStyles(styles)(connect(mapStateToProps)(Login));
