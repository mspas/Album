import React, { Component } from "react";
import AuthService from "./auth.service";

export default function withAuth(AuthComponent) {
  const _auth = new AuthService();
  return class AuthWrapped extends Component {
    constructor() {
      super();
      this.state = {
        user: null,
      };
    }

    componentDidMount() {
      if (!_auth.loggedIn()) {
        this.props.history.replace("/login");
      } else {
        try {
          const profile = _auth.getEmail(_auth.getToken());
          this.setState({
            user: profile,
          });
        } catch (err) {
          _auth.logout();
          this.props.history.replace("/login");
        }
      }
    }

    render() {
      if (this.state.user) {
        return (
          <AuthComponent history={this.props.history} user={this.state.user} />
        );
      } else {
        return null;
      }
    }
  };
}
