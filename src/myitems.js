// myitems.js here

import React, { Component } from 'react';
import axios from 'axios';
import ShopItem from './ShopItem';
import { Link } from 'react-router-dom';
import Header from './Header';
import "./App.css";



const BASE_URL = 'http://localhost:8000';




class Inventory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items_myitems: [],

      description: '',
      price: '',
      username: '',
      password: '',
      loggedIn: false,
      status: 'sale',  // Default status to fetch items on sale
      title: '',
      price: '',

    };
  }

  // Method called when the component is mounted
  componentDidMount() {
    this.fetch(); // Fetch user items on mount


  }

  // 7. Add item
  // Add methods to handle form inputs and submission
  handleInputChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  // 7. Add item
  // Method to handle form submission for adding new items
  handleFormSubmit = event => {
    event.preventDefault();
    const access_token = localStorage.getItem('access_token');


    const { title, description, price } = this.state;

      // Check if the description is empty
  if (!description.trim()) {
    alert("You must have a description to add an item");
    return;  // Stop the function here

  }

      // Check if the title is empty
      if (!title.trim()) {
        alert("You must have a title to add an item");
        return;  // Stop the function here
        
      }

          // Check if the price is empty
          if (!price.trim()) {
            alert("You must have a price to add an item");
            return;  // Stop the function here
            
          }

    axios.post(`${BASE_URL}/create_item/`, {
      title,
      description,
      price
    }, {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    })
      .then(response => {
        alert("Item added successfully");   // Added this line to give feedback when an item is added successfully
        this.fetch();  // Refresh the items list. 
      })
      .catch(error => console.error(`Error: ${error}`));
  };

  // Method to handle status change for filtering items
  handleChange = (event) => {
    const newStatus = event.target.value;
    this.setState({ status: newStatus }, this.fetch);
  }

  // Fetch user items based on the current status filter
  fetch = () => {
    const access_token = localStorage.getItem('access_token');
    axios.get(`${BASE_URL}/get_user_items?status=${this.state.status}`, {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    })
      .then(response => {
        this.setState({ items_myitems: response.data.item_list });
      })
      .catch(error => console.error(`Error: ${error}`));
  }
  render() {
    const { items_myitems } = this.state;
    return (

      <div>

        <div className="header-box">
          <h2>
            {/* Header Box */}

          </h2>
          {/* <Header /> */}
          {/* <Header hideSearchBar={true} /> */}
          <Header hideSearchBar={true} disableSearch={true} />

        </div>


        {/* <Header /> */}
        <h2>Your Items</h2>

        {/* <Link to="/shop">
        <button>Go to Shop</button>
      </Link> */}

        <div className="centered-box">
          {/* Add form for adding new items */}
          <form onSubmit={this.handleFormSubmit}>
            <label>
              Title:
              <input type="text" name="title" onChange={this.handleInputChange} />
            </label>
            <label>
              Description:
              <input type="text" name="description" onChange={this.handleInputChange} />
            </label>
            <label>
              Price:
              <input type="number" name="price" min="0" step="0.01" onChange={this.handleInputChange} />
              {/* Added min="0" to prevent negative price input */}
            </label>
            <input type="submit" value="Add Item" />
          </form>
        </div>


        <select onChange={this.handleChange}>

          <option value="sale">On Sale</option>
          <option value="sold">Sold</option>
          <option value="purchased">Purchased</option>
        </select>

        <div>
          {items_myitems.map(item => <ShopItem key={item.id} data={item} fetch={this.fetch} />)}

        </div>



      </div >
    );
  }
}

export default Inventory;
