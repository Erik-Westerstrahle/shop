// ShopItem.js here



import React from 'react';
import "./App.css";
import axios from 'axios';
import Modal from 'react-modal';


const API_URL = "http://127.0.0.1:8000/";

class ShopItem extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      price: props.data.price,
      Id: props.data.id,
      current_user_id: -1,
      title: props.data.title,
      seller_id: props.data.seller,
      date_added: String,



    };
  }

  // Fetch the currently logged-in user
  fetchCurrentUser = () => {
    const access_token = localStorage.getItem('access_token');
    axios.get(`${API_URL}get_logged_in_user/`, {
      headers: { 'Authorization': `Bearer ${access_token}` }
    })
      .then(response => {
        this.setState({ current_user_id: response.data.user_id });
        console.log("Fetched User id:", response.data.user_id);
      })
      .catch(error => {
        console.error('There was an error fetching user id!', error);
      });
  }

  // 14.edit item
  // Method to edit the price of an item
  handleEditPrice = (itemId) => {
    const newPrice = prompt("Enter the new price:");

    // Validate that the newPrice is a valid number and is greater than 0
    if (newPrice && !isNaN(newPrice) && newPrice > 0) {
      this.editPrice(itemId, newPrice);
    } else {
      alert("Please enter a valid price greater than 0");
    }
  }


  // 14.edit item
  // Helper method to execute price edit
  editPrice = (itemId, newPrice) => {
    const access_token = localStorage.getItem('access_token');
    const newPriceFloat = parseFloat(newPrice);  // Convert newPrice to float

    axios.put(`${API_URL}edit_price/${itemId}/`, { price: newPriceFloat }, {
      headers: { 'Authorization': 'Bearer ' + access_token }
    })
      .then(response => {

        this.setState({ price: newPriceFloat });  // Use the float version of newPrice here as well
        alert("Price edited successfully");
        // Uncomment the below line to refresh the entire page
        window.location.reload();



      })

      .catch(error => {
        if (error.response.status == 403) {
          alert("You can only edit the price of your own items");
        }
        else {
          console.error('There was an error!', error);
        }




      });
  }



  // added for Display inventory
  // Fetch the current user's items
  getItems = () => {
    const access_token = localStorage.getItem('access_token');
    axios.get(`${API_URL}get_items/?status=${this.state.selectedOption}`, {
      headers: { 'Authorization': access_token }
    })
      .then(response => {
        this.setState({ items: response.data.item_list });
        console.log(response.data.item_list)
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }

  // Print the item details
  PrintData = (props) => {

    return (<div>

      <p>Title: <strong>{props.data.title}</strong></p>
      <p>Description: <strong>{props.data.description}</strong></p>
      <p>Price: <strong>{props.data.price}</strong></p>
      <p>Date Added: <strong>{props.data.date_added}</strong></p>


    </div>)
  }



  async getCartId() {
    let response = await axios.get(`${API_URL}get_cart/`)
    let cartId = response.data.cartId;
    return cartId;
  }



  // Handle adding the item to the cart
  handleAddToCart = (itemId, price) => {
    const access_token = localStorage.getItem('access_token');
    console.log(access_token)

 // Check if the user is not logged in
 if (!access_token) {
  alert("You are not logged in, you cannot add an item to the cart");
  return;
}

    axios.post(`${API_URL}add_to_cart/${itemId}/`, { price: price }, {
      headers: { 'Authorization': 'Bearer ' + access_token }
    })
      .then(response => {
        alert("Item added to cart");

      })
      .catch(error => {
        if (error.response && error.response.data && error.response.data.detail) {
          alert(error.response.data.detail); // Shows the error message from the server in a popup
        } else {
          console.error('There was an error!', error);
        }
      });
  }

  // Handle removing the item from the cart
  handleRemoveFromCart = (itemId) => {
    const access_token = localStorage.getItem('access_token');

    axios.delete(`${API_URL}remove_from_cart/${itemId}/`, {
      headers: {
        'Authorization': 'Bearer ' + access_token
      }
    })
      .then(response => {
        alert("Item removed from cart");
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }



  // Invoked immediately after a component is mounted
  componentDidMount() {
    this.fetchCurrentUser(); // Fetch the current user once the component mounts

    console.log(this.props.data)
  }

  // Render method of the ShopItem component
  render() {
    // Extract required data from the state
    const { price, title, Id, seller_id, current_user_id } = this.state;
    const currentUserId = this.state.current_user_id;
    const isAvailable = (this.props.data.buyer === null);  // Check if item has a buyer (sold)

    // console.log("Item Sold:", isAvailable);  // Print out if the item is sold
    // console.log("Current User:", currentUserId);  // Print out the current user ID
    // console.log("Seller ID:", seller_id);  // Print out the seller ID
    console.log(isAvailable && (current_user_id === seller_id));  // Print out the seller ID
    console.log(isAvailable);
    console.log(current_user_id === seller_id);
    console.log(seller_id)

    return (
      <div className="shop-item">
        {this.PrintData(this.props)}


        {isAvailable && current_user_id !== seller_id && (
          <button onClick={() => this.handleAddToCart(Id, price)}>Add to cart</button>

        )}

        {isAvailable && current_user_id === seller_id && (
          <button onClick={() => this.handleEditPrice(Id)}>Edit Price</button>
        )}

        {

        }


      </div>
    );
  }





  //added for  Display inventory
  handleOptionChange = (event) => {
    this.setState({
      selectedOption: event.target.value
    });
  };
}








export default ShopItem;