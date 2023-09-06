// Signup.js

import React from 'react';
import axios from 'axios';
import './App.css';
import Header from './Header';

const API_URL = "http://127.0.0.1:8000/";

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      itemsForSale: [],
      items_sold: [],
      items_bought: [],
      ItemToAddName: "",
      ItemToAddDescription: "",
      ItemToAddPrice: "",
      ShowItemToAdd: false,
      selectedOption: 'items_sold',

      username: "",
      password: "",
      email: "",
      first_name: "",
      last_name: "",
    };

    // Bind the handleSubmit method to the current instance
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  // Method to handle change in form input fields
  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  // Method to handle form submission
  handleSubmit(event) {
    event.preventDefault();

    axios.post(`${API_URL}signup/`, {
      username: this.state.username,
      password: this.state.password,
      email: this.state.email,
      first_name: this.state.first_name,
      last_name: this.state.last_name,
    })
      .then(response => {
        console.log(response);
        alert("Signup Successful!"); // Alert the user on successful signup
        //  redirect the user to login page here after singup if needed
      })
      .catch(error => {
        console.error('There was an error!', error);
        alert("Signup Failed. Please try again.");
      });
  }


  render() {
    return (
      <div>
         <div className="App">
        <div className="header-box">
          <h2>
            {/* Header Box */}

          </h2>
      
          <Header hideSearchBar={true} disableSearch={true} />
          {/* Add any other controls or links that is needed in the header */}
        </div>
        {this.state.itemsForSale.length > 0 && this.state.itemsForSale[0].title}

        {/* //added */}
        <div className="centered-box"> 
        <div className="signupForm">
          <h1>Signup</h1>
          <form onSubmit={this.handleSubmit}>
            <label>
              Username:
              <input
                type="text"
                name="username"
                value={this.state.username}
                onChange={this.handleChange}
                required
              />
            </label>
            <br />
            <label>
              Password:
              <input
                type="password"
                name="password"
                value={this.state.password}
                onChange={this.handleChange}
                required
              />

              {/* new */}
            </label>
            <br />
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={this.state.email}
                onChange={this.handleChange}
                required
              />
            </label>
            <br />
            <label>

              First Name:
              <input
                type="text"
                name="first_name"
                value={this.state.first_name}
                onChange={this.handleChange}
                required
              />
            </label>
            <br />
            <label>
              Last Name:
              <input
                type="text"
                name="last_name"
                value={this.state.last_name}
                onChange={this.handleChange}
                required
              />
            </label>

            <br />
            <input type="submit" value="Signup" />
          </form>
        </div>
      </div>
      </div>
      </div>
    )
  }

}

export default Signup; 
