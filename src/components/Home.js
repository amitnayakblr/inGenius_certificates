import React, { Component } from "react";
import { connect } from "react-redux";

import Album from "./Album";

class Home extends Component {

  render() {
    return (
      <Album />
    );
  }
}

function mapStateToProps(state) {
  return {
    isLoggingOut: state.auth.isLoggingOut,
    logoutError: state.auth.logoutError
  };
}

export default connect(mapStateToProps)(Home);
