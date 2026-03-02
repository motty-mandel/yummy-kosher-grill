import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaCartShopping } from "react-icons/fa6";
import { CartContext } from '../context/CartContext';
import '../css/Header.css';
import logo from '../assets/yummy-logo.jpg';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Header() {
    const navigate = useNavigate();
    const { getCartCount, isCartOpen, setIsCartOpen } = useContext(CartContext);
    const cartCount = getCartCount();

    return (
        <header>
            <div className="logo">
                <img src={logo} alt="yummy-logo" className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }} />
            </div>

            {/* <div className="fulfil">
                <button>Change</button>
                <p>Pickup at 12:00 PM</p>
            </div> */}

            <div className="cart">
                <button onClick={() => setIsCartOpen(!isCartOpen)} className="cart-button">
                    <FaCartShopping size={30} />
                    {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                </button>
            </div>

        </header>
    );
}