import React, { useState } from "react";
import menuList from '../menus/drinks.json';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Home.css';
import '../cssMobile/homeMobile.css';
import arayes from '../menuImages/arayes.jpg';

export default function Home() {
    const [activeId, setActiveId] = useState(null);

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
                    <h2 className="mt-5 mb-5 mx-5">{category.category}</h2>
                    <div className="d-flex flex-row justify-content-center flex-wrap">
                        {category.items.map((menuItems) => (
                            <div 
                                key={menuItems.id} 
                                className={`menu-item mx-5 d-flex flex-row justify-content-between ${activeId === menuItems.id ? 'active' : ''}`}
                                onClick={() => setActiveId(activeId === menuItems.id ? null : menuItems.id)}
                            >
                                <div className="itemInfo">
                                    <h3>{menuItems.item}</h3>
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
        </>
    )
}