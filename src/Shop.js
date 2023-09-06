// Shop.js

// python manage.py runserver



import React, { useState, useEffect } from 'react';
import ShopItem from './ShopItem';
import "./App.css";
import axios from 'axios';
import Header from './Header';
import Inventory from './myitems';
import { Link } from 'react-router-dom';


const API_URL = "http://127.0.0.1:8000/";

const ITEMS_PER_PAGE = 10;


class Shop extends React.Component {

  state = {

    itemsForSale: [], // List of items for sale
    ItemToAddName: "",
    ItemToAddDescription: "",
    ItemToAddPrice: "",
    ShowItemToAdd: false,
    selectedOption: 'items_sold',
    Page: 1,
    searchTerm: "",

    items_in_cart: [],
    Hidden_cart: true,
    itemsForSale: [],

    username: "",

  };





  // Method to handle changes in the search input
  handleSearchChange = event => {
    this.setState({ searchTerm: event.target.value }, () => {
      this.FetchItems(); // Fetch items after search term changes
    });
  }

  // Method to fetch items based on the current page and search term
  FetchItems = () => {
    const { Page, searchTerm } = this.state;

    axios.get(`${API_URL}get_items/?page=${Page}&search=${searchTerm}`) // 'Page' state variable here
      .then(response => {
        this.setState({
          itemsForSale: response.data.item_list,
          count: response.data.count,
          next: response.data.next,
          previous: response.data.previous
        });
      })

      .catch(error => {
        console.error('There was an error!', error);
      });
  }



  handleSearchChange = (inputSearchTerm) => {
    this.setState({ searchTerm: inputSearchTerm }, () => {
      this.FetchItems();
    });
  }

  FetchItems = () => {
    const { Page, searchTerm } = this.state;

    axios.get(`${API_URL}get_items/?page=${Page}&search=${searchTerm}`) // 'Page' state variable here
      .then(response => {
        this.setState({
          itemsForSale: response.data.item_list,
          count: response.data.count,
          next: response.data.next,
          previous: response.data.previous
        });
      })

      .catch(error => {
        console.error('There was an error!', error);
      });
  }



  // does this when started or reloaded
  componentDidMount() {
    this.FetchItems(); //  call the function

  }

  // Method to navigate to the next page
  nextPage = () => {
    this.setState(prevState => ({ Page: prevState.Page + 1 }), () => {
      this.FetchItems();
    });
  }

  // Method to navigate to the previous page
  prevPage = () => {
    this.setState(prevState => ({ Page: prevState.Page - 1 }), () => {
      this.FetchItems();
    });
  }






  // renders graphics
  render() {


    const { itemsForSale, count, Page } = this.state;

    // Calculate the number of pages based on the total count and items per page
    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);


    // Create an array of page numbers
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
      <div>
        <h1>Shop</h1>
        <div className="header-box">
          <h2>

            {/* Header Box */}

          </h2>
          <Header handleSearchChange={this.handleSearchChange} />


          {/* Search Bar */}
          {/* <input
          type="text"
          placeholder="Search..."
          value={this.state.searchTerm}
          onChange={this.handleSearchChange}
          className="search-bar"
        /> */}



          <div>

          </div>
        </div>



        <h2>Items</h2>
        <div className="items-box">



          {/*   // goes trough the index and gives every one a number, and creates as many itemss   */}
          {itemsForSale.map(item => <ShopItem key={item.id} data={item} />)}
        </div>
        <button onClick={this.prevPage}>Previous Page</button> {/*  this button  move to the previous page */}
        <button onClick={this.nextPage}>Next Page</button> {/*  this button  move to the next page */}
        {/* <Inventory /> */}


        <div className="pagination-container">
          {pages.map(pageNumber => (
            <div
              key={pageNumber}
              className={`page-number ${Page === pageNumber ? 'active' : ''}`}
              onClick={() => this.setState({ Page: pageNumber }, this.FetchItems)}
            >
              {pageNumber}
            </div>
          ))}
        </div>

      </div>



    );

  }







}

export default Shop;
