import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import Link from '@material-ui/core/Link';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';

import { myFirebase, db } from '../firebase/firebase';


const styles = (theme) => ({
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
    alignItems: "center",
    marginBottom: theme.spacing(2),
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
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    padding: theme.spacing(3, 2),
    marginTop: 'auto',
  },
});

class Verify extends Component {
    constructor(props) {
        super(props);
        this.state = {
            certid: '',
            certError: "",
            cert: "",
            events: [],
            result: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
      }

      handleChange(event) {
        this.setState({certid: event.target.value});
      }

      handleSubmit(event) {
            var certid = this.state.certid;
            var certsplit = certid.split("/", 2);

            const self = this;

            var snap = db.collection('events').doc(certsplit[0]);
            snap.get()
            .then(doc => {
                if (!doc.exists) {
                    self.setState({certError: "Incorrect Certificate ID"});
                } else {
                    const images = myFirebase.storage().ref().child(doc.id);
                    const image = images.child(certsplit[1]+".png");

                    image.getDownloadURL().then(function(url) {
                        self.setState({events: [...self.state.events, {"id": doc.id, "data": doc.data(), "cert": url}]});
                        self.setState({result: true});
                    }).catch(function(){
                        self.setState({certError: "Incorrect Certificate ID"});
                    });
                }
            })
            .catch(err => {
                self.setState({certError: "Incorrect Certificate ID"});
            });

            event.preventDefault();
      }

  render() {
    const { classes } = this.props;
      return (
        <Container component="main" maxWidth="xs">
          <Paper className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Verify Certificate
            </Typography>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="certid"
              label="Certificate ID"
              name="certid"
              value={this.state.certid}
              onChange={this.handleChange}
            />
            {this.state.certError && (
              <Typography component="p" className={classes.errorText}>
                Certificate not found.
              </Typography>
            )}
            <Button
              type="button"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={this.handleSubmit}
            >
              Submit
            </Button>
            <br></br>
            <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
                <Link color="primary" href="/">
                    Login
                </Link>
            </Typography>
            {this.state.result && (
            <Card className={classes.card}>
                <hr></hr>
                <CardMedia
                    className={classes.cardMedia}
                    image={this.state.events[0].cert}
                    title={this.state.events[0].data.name}
                />
                <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2">
                    {this.state.events[0].data.name}
                    </Typography>
                    <Typography>
                    {this.state.events[0].data.description}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small" color="primary" href={this.state.events[0].cert}>
                    View
                    </Button>
                    <Button size="small" color="secondary" href={this.state.events[0].data.url}>
                    Go to event
                    </Button>
                </CardActions>
            </Card>
            )}
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
              <Link color="inherit" href="https://dscnsec.com"> //change the link
                Explore inGenius
              </Link>
            </Typography>
          </footer>
          {/* End footer */}
        </Container>
      );
  }
}

export default withStyles(styles)(Verify);
