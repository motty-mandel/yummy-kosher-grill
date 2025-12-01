import React from "react";
import { FaCartShopping } from "react-icons/fa6";
import '../css/Header.css';
import logo from '../assets/yummy-logo.jpg';

export default function Header() {
    return (
        <header>
            <div className="logo">
                <img src={logo} alt="yummy-logo" className="logo" />
            </div>

            <div className="fulfil">
                <button>Change</button>
                <p>Pickup at 12:00 PM</p>
            </div>

            <div className="cart">
                <FaCartShopping size={30} />
            </div>
        </header>
    );
}