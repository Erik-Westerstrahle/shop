// Account.js here

import React, { Component } from 'react';
import axios from 'axios';
import Header from './Header';

const API_URL = 'http://127.0.0.1:8000/';



// Define the ChangePassword React component
class ChangePassword extends Component {
    // Constructor method to initialize the component's state and bind methods
    constructor(props) {
        super(props);
        this.state = {
            oldPassword: '',
            newPassword: '',
            passwordConfirm: '',
        };
    }

    // Method to handle the password change form submission
    handlePasswordChange = (event) => {

        // Prevents the default form submission behavior
        event.preventDefault();

        const { oldPassword, newPassword, passwordConfirm } = this.state;

        // Check if the new password and its confirmation match
        if (newPassword !== passwordConfirm) {
            alert("Passwords do not match!");
            return;
        }

        // Make a POST request to change the password
        axios.post(`${API_URL}/dj-rest-auth/password/change/`, {
            old_password: oldPassword,
            new_password1: newPassword,
            new_password2: passwordConfirm
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('access_token')}`
            }
        })
            .then(response => {
                // Reset state if the password change is successful
                this.setState({ oldPassword: '', newPassword: '', passwordConfirm: '' });
                alert("Password changed successfully");
            }).catch(error => {
                let empty_string = ''
                if (error.response.data.old_password) {
                    empty_string += error.response.data.old_password

                }
                alert(empty_string)


                alert("Password not changed ");
                console.error(error.response.data);
            });
    }

    // Method to handle input changes and update the component's state accordingly
    handleInputChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    // Render method to display the component's UI
    render() {
        const { oldPassword, newPassword, passwordConfirm } = this.state;

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
                {/* Here's the Header */}
                <h2>Change Password</h2>
                {/* <a className="shop-button" href="http://localhost:3000/shop">Go to Shop</a> */}
                <div className="centered-box">
                    <form onSubmit={(event) => this.handlePasswordChange(event)}>
                        <label>
                            Old Password:
                            <input name="oldPassword" type="password" value={oldPassword} onChange={this.handleInputChange} required />
                        </label>
                        <label>
                            New Password:
                            <input name="newPassword" type="password" value={newPassword} onChange={this.handleInputChange} required />
                        </label>
                        <label>
                            Confirm New Password:
                            <input name="passwordConfirm" type="password" value={passwordConfirm} onChange={this.handleInputChange} required />
                        </label>
                        <button type="submit">Change Password</button>
                    </form>
                </div>
            </div>
        );
    }

}

export default ChangePassword;
