import React, { Component } from 'react';

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from "@material-ui/core/styles";
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';

import sha1 from 'crypto-js/sha1';
import { connect } from "react-redux";
import { logoutUser } from "../actions";
import { myFirebase, db } from '../firebase/firebase';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://xprilion.com">
        @xprilion
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
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
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
  errorText: {
    margin: 10,
    textAlign: "center"
  },
});

class Album extends Component {
  constructor() {
    super()
		this.state = {
			user: null,
      loading: true,
      events: [],
		};
  };

  componentDidMount() {
    const self = this;
		myFirebase.auth().onAuthStateChanged(function(user) {
			if (user) {
        self.setState({ user });

        var email = user.email;
        db.collection('events').get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            const images = myFirebase.storage().ref().child(doc.id);
            const image = images.child(sha1(email).toString().substring(0, 8)+".png");

            image.getDownloadURL().then(function(url) {
              self.setState({events: [...self.state.events, {"id": doc.id, "data": doc.data(), "cert": url}]});
            }).catch(function(){
              console.log(" No certificate at this event");
            });
          });
        })
        .catch((err) => {
          console.log('Error getting documents', err);
        });

			} else {
				self.setState({ user: null });
			}

			if (self.state.loading) {
				self.setState({ loading: false });
			}
		});
  };

  handleLogout = () => {
    const { dispatch } = this.props;
    dispatch(logoutUser());
  };
  render() {
    const { classes } = this.props;
    const events = this.state.events;

    return (
      <React.Fragment>
        <CssBaseline />
        <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
           inGenius Certificates
          </Typography>
          <Button color="inherit" onClick={this.handleLogout} >Logout</Button>
        </Toolbar>
      </AppBar>
    </div>
        <main>
          {/* Hero unit */}
          <div className={classes.heroContent}>
            <Container maxWidth="sm">
              <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                Certificates
              </Typography>
              <Typography variant="h5" align="center" color="textSecondary" paragraph>
                All your wonderful earnings with inGenius, centrally stored, available for verification forever!
              </Typography>
            </Container>
          </div>
          {this.state.events.length > 0 ?
            (
              <Container className={classes.cardGrid} maxWidth="md">
                {/* End hero unit */}
                <Grid container spacing={4}>
                  {events.map((card) => (
                    <Grid item key={card.id} xs={12} sm={6} md={4}>
                      <Card className={classes.card}>
                        <CardMedia
                          className={classes.cardMedia}
                          image={card.cert}
                          title={card.data.name}
                        />
                        <CardContent className={classes.cardContent}>
                          <Typography gutterBottom variant="h5" component="h2">
                            {card.data.name}
                          </Typography>
                          <Typography>
                            {card.data.description}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <Button size="small" color="primary" href={card.cert} target="_blank">
                            View
                          </Button>
                          <Button size="small" color="secondary" href={card.data.url} target="_blank">
                            Go to event
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Container>
            )
            :
            (
              <Typography component="p" className={classes.errorText}>
                You do not have any certificates. You can earn them with us by attending online/offline workshops, or successfully completing challenges!
              </Typography>
            )
          }
        </main>
        {/* Footer */}
        <footer className={classes.footer}>
          <Typography variant="h6" align="center" gutterBottom>
            With <span role="img" aria-label="heart">❤️</span> from inGenius
          </Typography>
          <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
            <Link color="inherit" href="https://ingeniushack.tech/">
              Explore inGenius
            </Link>
          </Typography>
          <Copyright />
        </footer>
        {/* End footer */}
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    isLoggingOut: state.auth.isLoggingOut,
    logoutError: state.auth.logoutError
  };
}

export default withStyles(styles)(connect(mapStateToProps)(Album));
