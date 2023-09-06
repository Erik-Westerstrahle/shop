// Header.js

import React from 'react';
//import myImage from './logo-placeholder-image.png'; <img src={myImage} className="Icon" ></img>
import "./App.css";
import axios from 'axios';
import CartComponent from "./CartComponent";
import { Link } from 'react-router-dom';



const API_URL = "http://localhost:8000/"


// Header class definition
class Header extends React.Component {
  constructor(props) {
    super(props);
    // Initial state of the Header component
    this.state = {

      itemsForSale: [],


      ItemToAddName: "",
      ItemToAddDescription: "",
      ItemToAddPrice: "",
      ShowItemToAdd: false,
      selectedOption: 'items_sold',
      Page: 1,
      searchTerm: "",
      Hidden_cart: true,
      items_in_cart: [],
      total_price: 0,
      response_list_price: [],
      unavailableItems: [],
      transactionHalted: false,
      notifications: {},
      username: "",






    };

  }


  // Method to fetch the logged-in user's name
  fetchUsername = () => {
    const access_token = localStorage.getItem('access_token');
    axios.get(`${API_URL}get_logged_in_user/`, {
      headers: { 'Authorization': `Bearer ${access_token}` }
    })
      .then(response => {
        this.setState({ username: response.data.username }); // Update username in the state
        console.log("Fetched Username:", response.data.username);
      })
      .catch(error => {
        console.error('There was an error fetching username!', error);
      });
  }


  // Method to handle changes in the search form
  handleFormChange = event => {
    this.setState({ searchTerm: event.target.value }, () => {
      this.props.handleSearchChange(event.target.value);
    });
  }


  // Lifecycle method that gets called once the component has been mounted 
  componentDidMount() {
    this.fetchUsername(); // Fetch the username when the component is mounted

  }




  // Render method of the Header component
  render() {


        // Check if the user is logged in by checking for the access_token in localStorage
        const isLoggedIn = localStorage.getItem('access_token');



    return (

      

      <div className="Header">
        <div className="site-logo">
          {/* Your logo content here, e.g.: <img src={myImage} className="Icon" alt="Site Logo" /> */}
          {/* Site Logo */}
          <Link to="/shop" className="marketplace-button">Market Place</Link>
        </div>


        <input
          type="text"
          placeholder="Search..."
          value={this.state.searchTerm}
          onChange={this.handleFormChange}
          className="search-bar"
          disabled={this.props.disableSearch}
        />

        
        { isLoggedIn ? (
                    // Show these buttons if the user is logged in
                    <>
        <div className="username-display">
          Username: {this.state.username}

        </div>
        {/* {!this.props.hideSearchBar && (
    <input
        type="text"
        placeholder="Search..."
        value={this.state.searchTerm}
        onChange={this.handleFormChange}
        className="search-bar"
    />
)} */}

      





        <Link to="/login" className="logout-button">
          Log Out
        </Link>
        <Link to="/myitems" className="my-items-button">
          My Items
        </Link>
        <Link to="/account" className="change-password-button">
          Change Password
        </Link>
        {/* <Link to="/shop" className="marketplace-button">
                 Market Place
            </Link> */}

        <CartComponent />
            
        </>
                ) : (
                    // Show these buttons if the user is NOT logged in
                    <>
                        <Link to="/signup" className="signup-button">
                            Signup
                        </Link>
                        <Link to="/login" className="signin-button">
                            Signin
                        </Link>
                    </>
                )}



      </div>


    );
  }
}

export default Header;