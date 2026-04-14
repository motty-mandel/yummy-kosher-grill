import React, { useState, useEffect, useContext } from "react";
import { CartContext } from '../context/CartContext';
import API_BASE_URL from '../config.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Home.css';
import '../cssMobile/homeMobile.css';
import arayes from '../assets/new-pargit.jpg';

export default function Home() {
    const [activeId, setActiveId] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedModifiers, setSelectedModifiers] = useState({});
    const [validationError, setValidationError] = useState(null);
    const [menuOpen, setMenuOpen] = useState(true);
    const [loadingStatus, setLoadingStatus] = useState(true);
    const [menuList, setMenuList] = useState([]);
    const { addToCart } = useContext(CartContext);

    useEffect(() => {
        fetchMenuStatus();
        fetchMenuItems();
    }, []);

    const fetchMenuItems = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/menu-items`);
            if (response.ok) {
                const data = await response.json();
                setMenuList(data);
            }
        } catch (error) {
            console.log('Could not fetch menu items');
        }
    };

    const fetchMenuStatus = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/menu-status`);
            if (response.ok) {
                const data = await response.json();
                setMenuOpen(data.isOpen);
            }
        } catch (error) {
            console.log('Could not fetch menu status, assuming open');
            setMenuOpen(true);
        } finally {
            setLoadingStatus(false);
        }
    };

    useEffect(() => {
        if (selectedItem) {
            document.body.style.overflow = 'hidden';
            setValidationError(null);
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [selectedItem]);



    return (
        <>
            {!menuOpen && (
                <div className="menu-closed-banner">
                    <h2>🔴 Menu Closed</h2>
                    <p>The restaurant is currently closed. Please check back during business hours.</p>
                </div>
            )}
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
                        Sunday - Thursday: 12PM - 8PM <br />
                        Friday: Closed
                    </h6>
                </div>
                <img src="grill-food.jpg" alt="picture-of-grilled-food" />
            </div>
            {menuOpen ? (
                <>
                    {menuList.map((category) => (
                        <div className="categories" key={category.category}>
                            <h2 className="mt-5 mb-2 mx-5">{category.category}</h2>
                            <div className="menu-items-wrapper">
                                {category.items.map((menuItems) => (
                                    <div 
                                        key={menuItems.id} 
                                        className={`menu-item d-flex flex-row justify-content-between ${activeId === menuItems.id ? 'active' : ''} ${menuItems.outOfStock ? 'out-of-stock' : ''}`}
                                        onClick={() => !menuItems.outOfStock && setSelectedItem(menuItems)}
                                        style={{ opacity: menuItems.outOfStock ? '0.6' : '1', cursor: menuItems.outOfStock ? 'not-allowed' : 'pointer' }}
                                    >
                                        <div className="itemInfo">
                                            <h5>{menuItems.item}</h5>
                                            <h6>{menuItems.price}</h6>
                                            <h6 className="description">{menuItems.description}</h6>
                                            {menuItems.outOfStock && <span className="badge bg-danger">Out of Stock</span>}
                                        </div>
                                        <div className="itemImage">
                                            <img src={menuItems.image} alt="menu-item-photo" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </>
            ) : (
                <div className="menu-closed-content">
                    <p>Menu items are not available at this time.</p>
                </div>
            )}
            
            {selectedItem && (
                <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-btn" onClick={() => setSelectedItem(null)}>×</button>
                        
                        <div className="modal-image">
                            <img src={selectedItem.image} alt={selectedItem.item} />
                        </div>
                        
                        <div className="modal-details">
                            <h2>{selectedItem.item}</h2>
                            <p className="description">{selectedItem.description}</p>
                            <p className="price">{selectedItem.price}</p>
                            
                            {selectedItem.outOfStock && (
                                <div className="alert alert-danger mb-3">
                                    This item is currently out of stock.
                                </div>
                            )}
                            
                            {!selectedItem.outOfStock && selectedItem.modifiers && selectedItem.modifiers.length > 0 ? (
                                <div className="modifiers-section">
                                    <h4>Modify Your Order</h4>
                                    {selectedItem.modifiers.map((modifier) => {
                                        const isRadio = modifier.type === 'radio';
                                        const isRequired = modifier.required;
                                        const maxSelections = modifier.maxSelections;
                                        const currentSelections = selectedModifiers[modifier.name] || [];
                                        const isLimitReached = maxSelections && currentSelections.length >= maxSelections;
                                        
                                        return (
                                            <div key={modifier.name} className="modifier-group">
                                                <h5>
                                                    {modifier.name}
                                                    {isRequired && <span className="required-indicator"> *</span>}
                                                </h5>
                                                {maxSelections && (
                                                    <p className="selection-limit">
                                                        Select up to {maxSelections} option{maxSelections !== 1 ? 's' : ''}
                                                    </p>
                                                )}
                                                <div className={isRadio ? 'radio-group' : 'checkbox-group'}>
                                                    {modifier.options.map((option) => (
                                                        <label key={option} className={isRadio ? 'radio-label' : 'checkbox-label'}>
                                                            <input
                                                                type={isRadio ? 'radio' : 'checkbox'}
                                                                name={isRadio ? modifier.name : undefined}
                                                                value={option}
                                                                checked={currentSelections.includes(option)}
                                                                disabled={isRadio ? false : (isLimitReached && !currentSelections.includes(option))}
                                                                onChange={(e) => {
                                                                    const key = modifier.name;
                                                                    const current = selectedModifiers[key] || [];
                                                                    
                                                                    if (isRadio) {
                                                                        // Radio: only one selection allowed
                                                                        setSelectedModifiers({
                                                                            ...selectedModifiers,
                                                                            [key]: [option]
                                                                        });
                                                                    } else {
                                                                        // Checkbox: respect maxSelections
                                                                        if (e.target.checked) {
                                                                            if (!maxSelections || current.length < maxSelections) {
                                                                                setSelectedModifiers({
                                                                                    ...selectedModifiers,
                                                                                    [key]: [...current, option]
                                                                                });
                                                                            }
                                                                        } else {
                                                                            setSelectedModifiers({
                                                                                ...selectedModifiers,
                                                                                [key]: current.filter(item => item !== option)
                                                                            });
                                                                        }
                                                                    }
                                                                }}
                                                            />
                                                            {option}
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : null}
                            

                            <button 
                                className="add-to-cart-btn"
                                disabled={selectedItem.outOfStock}
                                onClick={() => {
                                    if (selectedItem.outOfStock) return;
                                    
                                    // Validate required modifiers
                                    const errors = [];
                                    if (selectedItem.modifiers) {
                                        selectedItem.modifiers.forEach((modifier) => {
                                            if (modifier.required) {
                                                const selected = selectedModifiers[modifier.name] || [];
                                                if (selected.length === 0) {
                                                    errors.push(`Please select ${modifier.name.toLowerCase()}`);
                                                }
                                            }
                                        });
                                    }
                                    if (errors.length > 0) {
                                        setValidationError(errors.join(', '));
                                        return;
                                    }

                                    // --- Hamburger price adjustment logic ---
                                    let itemToAdd = { ...selectedItem };
                                    let price = selectedItem.price;
                                    // Only apply for burgers with size modifier
                                    if (selectedItem.category === 'Burgers' || (selectedItem.modifiers && selectedItem.modifiers.some(m => m.name.toLowerCase().includes('size')))) {
                                        const sizeMod = selectedItem.modifiers.find(m => m.name.toLowerCase().includes('size'));
                                        if (sizeMod) {
                                            const selectedSizeArr = selectedModifiers[sizeMod.name] || [];
                                            let basePrice = 0;
                                            // Use the lowest price as base
                                            if (typeof price === 'string' && price.includes('-')) {
                                                basePrice = parseFloat(price.split('-')[0].replace(/[^\d.]/g, ''));
                                            } else {
                                                basePrice = parseFloat((price || '').replace(/[^\d.]/g, ''));
                                            }
                                            let extra = 0;
                                            if (selectedSizeArr.length > 0) {
                                                const sizeStr = selectedSizeArr[0];
                                                if (sizeStr.includes('220g')) extra = 4;
                                                if (sizeStr.includes('300g')) extra = 8;
                                            }
                                            itemToAdd.price = `$${(basePrice + extra).toFixed(2)}`;
                                        }
                                    }
                                    addToCart(itemToAdd, 1, selectedModifiers);
                                    setSelectedItem(null);
                                    setSelectedModifiers({});
                                    setValidationError(null);
                                }}
                            >
                                {selectedItem.outOfStock ? 'Out of Stock' : 'Add to Cart'}
                            </button>
                            
                            {validationError && (
                                <div className="error-message">
                                    {validationError}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}