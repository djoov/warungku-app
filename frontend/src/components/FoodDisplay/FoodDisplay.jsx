import React, { useContext } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'
const FoodDisplay = ({category, limit}) => {

    const {food_list} = useContext(StoreContext);

    // Filter items: only available items, and by category
    const filteredList = food_list.filter(item => item.available !== false && (category === "All" || category === item.category));
    // Apply limit if provided
    const displayList = limit ? filteredList.slice(0, limit) : filteredList;

  return (
    <div className='food-display' id='food-display'>
        <h2>Menu WarungKu</h2>
        <div className="food-display-list">
            {displayList.map((item,index)=> {
                return <FoodItem key={index} id={item._id} name={item.name} description={item.description} price={item.price} image={item.image }/>
            })}
        </div>
    </div>
  )
}

export default FoodDisplay