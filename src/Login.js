


// Login.js here

import React, { Component } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import Header from './Header';


const API_URL = 'http://127.0.0.1:8000/';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      loggedIn: false,   // State to check if a user is logged in
    };
  }

  // Method to handle login
  handleLogin = () => {

    axios.post(`${API_URL}dj-rest-auth/login/`, {
      username: this.state.username,
      password: this.state.password
    }).then(response => {
      console.log(response)
      console.log(response.data)
      console.log(response.data.access)
      // Save the received token
      localStorage.setItem('access_token', response.data.access);

      this.setState({ loggedIn: true });   // Update state to reflect login status
    }).catch(error => {
      // Handle error
      localStorage.removeItem('access_token');
      console.log(error);
      alert("Your username or password is wrong."); // alert if user fails to login

    });
  }

  // Render method of the Login component
  render() {

    // Check if the user is logged in
    if (this.state.loggedIn) {
      return <Navigate to="/shop" />;   // Redirect to the "/shop" route if logged in
    }

    return (
      <div>
        <div className="header-box">
          <h2>
            {/* Header Box */}

          </h2>
          {/* <Header /> */}
          {/* <Header hideSearchBar={true} /> */}
          <Header hideSearchBar={true} disableSearch={true} />
          {/* Add any other controls or links you want in the header */}
        </div>
        <div className="centered-box">
          <input type="text" placeholder="Username" onChange={e => this.setState({ username: e.target.value })} />
          <input type="password" placeholder="Password" onChange={e => this.setState({ password: e.target.value })} />
          <button onClick={this.handleLogin}>Login</button>
        </div>
      </div>
    );
  }
}

export default Login;

