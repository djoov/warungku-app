import React, { useState } from 'react'
import './Menu.css'
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu'
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay'

const Menu = () => {
    const [category, setCategory] = useState("All");

    return (
        <div className='menu-page'>
            <div className="menu-header">
                <h2>Our Full Menu</h2>
                <p>Explore our wide variety of delicious meals, prepared fresh just for you.</p>
            </div>
            <ExploreMenu category={category} setCategory={setCategory} />
            <FoodDisplay category={category} />
        </div>
    )
}

export default Menu
