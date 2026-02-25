import React, { useState, useEffect } from "react";
import menuList from '../menus/drinks.json';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Home.css';
import '../cssMobile/homeMobile.css';
import arayes from '../menuImages/arayes.jpg';

export default function Home() {
    const [activeId, setActiveId] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedModifiers, setSelectedModifiers] = useState({});

    useEffect(() => {
        if (selectedItem) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [selectedItem]);



    return (
        <>
            <div className="hero d-flex align-items-center justify-content-center">
                <div className="info d-flex flex-column align-items-center position-absolute">
                    <h6>
                        15511 Oak Grove Dr. SA, Texas <br />
                        (210) 750-6770
                    </h6>
                    <h3>
                        Yummy Kosher Grill
                    </h3>
                    <h6>
                        Opening Hours <br />
                        Sunday: 12:30PM - 8PM <br />
                        Monday - Thursday: 12PM - 8PM <br />
                        Friday: 12PM - 4PM
                    </h6>
                </div>
                <img src="grill-food.jpg" alt="picture-of-grilled-food" />
            </div>
            {menuList.map((category) => (
                <div key={category.category}>
                    <h2 className="my-2 mx-5">{category.category}</h2>
                    <div className="menu-items-wrapper">
                        {category.items.map((menuItems) => (
                            <div 
                                key={menuItems.id} 
                                className={`menu-item d-flex flex-row justify-content-between ${activeId === menuItems.id ? 'active' : ''}`}
                                onClick={() => setSelectedItem(menuItems)}
                            >
                                <div className="itemInfo">
                                    <h4>{menuItems.item}</h4>
                                    <h5>{menuItems.description}</h5>
                                    <h5>{menuItems.price}</h5>
                                </div>
                                <div className="itemImage">
                                    <img src={arayes} alt="" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
            
            {selectedItem && (
                <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-btn" onClick={() => setSelectedItem(null)}>×</button>
                        
                        <div className="modal-image">
                            <img src={arayes} alt={selectedItem.item} />
                        </div>
                        
                        <div className="modal-details">
                            <h2>{selectedItem.item}</h2>
                            <p className="description">{selectedItem.description}</p>
                            <p className="price">{selectedItem.price}</p>
                            
                            {selectedItem.modifiers && selectedItem.modifiers.length > 0 ? (
                                <div className="modifiers-section">
                                    <h4>Modify Your Order</h4>
                                    {selectedItem.modifiers.map((modifier) => (
                                        <div key={modifier.name} className="modifier-group">
                                            <h5>{modifier.name}</h5>
                                            <div className="checkbox-group">
                                                {modifier.options.map((option) => (
                                                    <label key={option} className="checkbox-label">
                                                        <input
                                                            type="checkbox"
                                                            value={option}
                                                            checked={selectedModifiers[modifier.name]?.includes(option) || false}
                                                            onChange={(e) => {
                                                                const key = modifier.name;
                                                                const current = selectedModifiers[key] || [];
                                                                if (e.target.checked) {
                                                                    setSelectedModifiers({
                                                                        ...selectedModifiers,
                                                                        [key]: [...current, option]
                                                                    });
                                                                } else {
                                                                    setSelectedModifiers({
                                                                        ...selectedModifiers,
                                                                        [key]: current.filter(item => item !== option)
                                                                    });
                                                                }
                                                            }}
                                                        />
                                                        {option}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : null}
                            
                            <button className="add-to-cart-btn">Add to Cart</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}