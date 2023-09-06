// CartComponent

import React from 'react';

import "./App.css";
import axios from 'axios';
import ShopItem from './ShopItem';


const API_URL = "http://localhost:8000/"



class CartComponent extends React.Component {
  constructor(props) {
    super(props);

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






    };

  }


  // Method to update items for sale
  updateItemsForSale = (updatedItem) => {
    this.setState(prevState => {
      const updatedItemsForSale = prevState.itemsForSale.map(item =>
        item.id === updatedItem.id ? updatedItem : item
      );
      return { itemsForSale: updatedItemsForSale };
    });
  }

  // Lifecycle method which gets called when the component updates
  componentDidUpdate(prevProps, prevState) {
    if (prevState.items_in_cart !== this.state.items_in_cart) {
      // Check if any cart item's price has changed and update the 'changed' flag
      const updatedItems = this.state.items_in_cart.map(item => {
        const prevItem = prevState.items_in_cart.find(prevCartItem => prevCartItem.item.id === item.item.id);
        if (prevItem && prevItem.item.price !== item.item.price) {
          return {
            ...item,
            changed: false
          };
        }
        return item;
      });

      // Check if the updated items are different from current items
      const areItemsDifferent = updatedItems.some((item, index) => {
        return item.changed !== this.state.items_in_cart[index].changed;
      });

      // Only update state if there are actual changes
      if (areItemsDifferent) {
        this.setState({ items_in_cart: updatedItems });
      }
    }
  }






  // Method to open the cart
  handleOpen = () => {
    const access_token = localStorage.getItem('access_token');
    console.log(access_token)

  // Check if the user is not logged in
  if (!access_token) {
    alert("You are not logged in, You cannot open the cart");
    return;
  }


    axios.get(`${API_URL}get_cart_contents/`, {
      headers: { 'Authorization': `Bearer ${access_token}` }
    })
      .then(response => {
        const updatedCartItems = response.data.items_in_cart.map(cartItem => {
          const originalItem = this.state.itemsForSale.find(item => item.id === cartItem.item.id);
          console.log(`Original Price: ${originalItem ? originalItem.price : 'Not found'}, Cart Price: ${cartItem.item.price}, New Price: ${response.data.new_price}`);
          // If the item is found and its price is different, set changed to true
          if (originalItem && originalItem.price !== cartItem.item.price) {
            return {
              ...cartItem,
              changed: true
            };
          }
          return cartItem;
        });

        this.setState({
          items_in_cart: updatedCartItems,
          total_price: response.data.total_price,
          Hidden_cart: false
        });

        console.log(response.data)
        console.log(response.data.items_in_cart)
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }

  // Method to close the cart
  handleClose = () => {
    // Reset changed flag for all cart items when the cart is closed
    const resetItems = this.state.items_in_cart.map(item => ({
      ...item,
      changed: false
    }));
    this.setState({ items_in_cart: resetItems, Hidden_cart: true });
    console.log('Closing cart...');
  }


  // 10. Pay a.
  // Method to handle payment process
  handlePay = () => {
    //  Reset the changed flag for all items in the cart
    const resetItemsInCart = this.state.items_in_cart.map(cartItem => ({
      ...cartItem,
      changed: false
    }));
    this.setState({ items_in_cart: resetItemsInCart, notifications: {} });  // Reset notifications

    console.log('cartItem:', this.state.items_in_cart);  // Log cartItem
    console.log('Items in cart:', this.state.items_in_cart);


    axios.post(`${API_URL}get_item_prices/`,
      { item_price_tracking: this.state.items_in_cart },
      { headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` } }
    )
      .then(response => {
        console.log('Server responses:', response.data.detail);

        const updatedItemsFromServer = response.data.detail;
        let newItemsInCart = [...this.state.items_in_cart];
        let transactionHalted = false;
        let newTotalPrice = 0;

        // const tempNotifications = {}; // Create a temp object to store notifications

        updatedItemsFromServer.forEach((updatedItem, index) => {
          const newPrice = parseFloat(updatedItem.new_price);
          // console.log(`.${index + 1} - New price for item ${index + 1}:`, newPrice);
          // console.log(`.${index + 1} - Type of server returned price:`, typeof (updatedItem.new_price));
          // console.log(typeof (newPrice))
          // console.log(typeof (updatedItem.new_price))
          if (updatedItem.changed_prices) {
            newItemsInCart[index] = {
              ...newItemsInCart[index],
              item: {
                ...newItemsInCart[index].item,
                price: newPrice,
              },
              // changed: true,
              changed_prices: true,
            };
            transactionHalted = true;
            newTotalPrice += newPrice;  // Add each item's price to the new total price
            // console.log(`.${index + 1} - Price changed, new total price:`, newTotalPrice);
          }


          else { newTotalPrice += parseFloat(updatedItem.item.price); }

          // 10 b.
          // Checking for item availability





          updatedItemsFromServer.forEach((updatedItem) => {
            if (!updatedItem.available) {
              transactionHalted = true;
              const newNotification = {
                [updatedItem.item.id]: " Item is no longer available."
              };
              this.setState(prevState => ({
                notifications: {
                  ...prevState.notifications,
                  ...newNotification

                }

              }));
              console.log(newNotification)
            }
          });



        });









        this.setState({ items_in_cart: newItemsInCart, transactionHalted, total_price: newTotalPrice });
        console.log('Updated items in cart:', this.state.items_in_cart);
        console.log('Transaction halted:', this.state.transactionHalted);
        console.log('Total price:', this.state.total_price);





        // 10. pay c.
        // If no transactions were halted due to price change or unavailability, proceed with payment
        if (!transactionHalted) {
          axios.post(`${API_URL}handle_payment/`,
            { items_in_cart: newItemsInCart },
            { headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` } }
          )
            .then(response => {
              console.log('Payment responses:', response.data);

              // Update the state of items for sale with the sold items
              const soldItems = response.data.sold_items;
              soldItems.forEach(soldItem => this.updateItemsForSale(soldItem));

              // Clear the cart after successful payment
              this.setState({
                items_in_cart: [],
                total_price: 0,
                transactionHalted: false,
                notifications: {},
              });

              // Reload the web page after successful payment
              window.location.reload();

            })
            .catch(error => {
              console.error('There was an error!', error.response);
              console.error('Error data:', error.response.data);
              console.error('Error status:', error.response.status);


              // // Jury-rigged solution for 10. pay b.

              // Check if the error status is related to an item being unavailable
              if (error.response && error.response.status === 410) {

                // Extract the item ID from the error response (assuming the server sends it)
                const itemId = error.response.data.itemId;


                // Unique error code printed to the console
                console.error(`Error Code: ItemUnavailable for Item ID: ${itemId}`);

                // Update the notifications in state for the specific item
                this.setState(prevState => ({
                  notifications: {
                    ...prevState.notifications,
                    [itemId]: "Item is no longer available."
                  }
                }));
              }


              console.log('State after successful payment:', this.state);
            });
        }






      })
      .catch(error => {
        console.error('There was an error!', error.response);
        console.error('Error data:', error.response.data);
        console.error('Error status:', error.response.status);


        // 10 b.
        // Check if the error status is 409 (item not found)
        if (error.response.status === 409) {
          // Set a general notification
          this.setState(prevState => ({
            notifications: {
              ...prevState.notifications,
              // general: " Item has been removed.",

            }
          }));
        }


      });
  }


  // Method to remove an item from the cart
  handleRemoveFromCart = (itemId) => {
    const access_token = localStorage.getItem('access_token');

    axios.delete(`${API_URL}remove_from_cart/${itemId}/`, {
      headers: {
        'Authorization': 'Bearer ' + access_token
      }
    })
      .then(response => {
        alert("Item removed from cart");
        this.setState({ Hidden_cart: true }, () => {
          setTimeout(() => {
            this.handleOpen();
          }, 200); // delay of 200ms
        });
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }

















  render() {
    const { Hidden_cart, items_in_cart, total_price, transactionHalted } = this.state;

    const Cart_function = (props) => {
      const { Hidden_cart, handleClose, handlePay, items_in_cart, total_price, transactionHalted, notifications, handleRemoveFromCart } = props;

      console.log(items_in_cart)
      return (

        <div>
          <div className='Cart' hidden={Hidden_cart}>
            <button onClick={handleClose}> Close Cart</button>

            {notifications.general &&
              <div style={{ color: 'red', marginTop: '10px' }}>{notifications.general}</div>
            }


            <div className="column-layout">
              {items_in_cart.map((item, index) => (
                <div className="key_var" key={index}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ marginRight: '1vw' }}>{item.item.title}</span>
                    {/* <button onClick={() => handleRemoveFromCart(item.item.id)}>Remove from cart</button> */}
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                      {item.item.price}
                      {item.changed_prices &&
                        <span style={{ color: 'red', marginLeft: '10px' }}>Price has changed!!</span>
                      }
                      {notifications[item.item.id] &&
                        <div style={{ color: 'red' }}>{notifications[item.item.id]}</div>
                      }
                    </span>
                    <button onClick={() => handleRemoveFromCart(item.item.id)}>Remove from cart</button>
                  </div>
                  {/* 10 b. */}


                </div>
              ))}
              Total Price: {total_price}
              {transactionHalted && <div style={{ color: 'red' }}>
                {/* Some item prices have changed or are unavailable. Please review your cart. */}
              </div>}
              <button onClick={handlePay}> Pay</button>
            </div>
          </div>
        </div>
      )
    }



    return (
      <div >


        {/* <button onClick={this.handleOpen}> Cart</button> */}
        {<button className="cart-button" onClick={this.handleOpen}>Cart</button>}

        <Cart_function
          Hidden_cart={Hidden_cart}
          handleClose={this.handleClose}
          handlePay={this.handlePay}
          items_in_cart={items_in_cart}
          total_price={total_price}
          transactionHalted={transactionHalted}
          notifications={this.state.notifications}
          // handleRemoveFromCart={this.props.handleRemoveFromCart} // Pass the handleRemoveFromCart from ShopItem
          handleRemoveFromCart={this.handleRemoveFromCart} // Pass the handleRemoveFromCart from ShopItem

        />
        {/* 
        <ShopItem
          items_in_cart={this.state.items_in_cart}

        /> */}



      </div>

    );
  }
}

export default CartComponent;