import React, { useContext } from 'react'
import './ExploreMenu.css'
import { StoreContext } from '../../context/StoreContext'

const ExploreMenu = ({category, setCategory}) => {

  const { food_list } = useContext(StoreContext);

  // Extract unique categories dynamically from the data
  const categories = [...new Set(food_list.map(item => item.category))];

  return (
    <div className='explore-menu' id='explore-menu'>
        <h1>Explore our Product</h1>
        <p className='explore-menu-text'>Pilih menu favoritmu dari mitra WarungKu</p>
        <div className="explore-menu-list">
            {categories.map((cat, index) => {
                return (
                    <div onClick={() => setCategory(prev => prev === cat ? "All" : cat)} key={index} className='explore-menu-list-item'>
                        <div className={`category-badge ${category === cat ? "active" : ""}`}>
                            <p>{cat}</p>
                        </div>
                    </div>
                )
            })}
        </div>
        <hr />
    </div>
  )
}

export default ExploreMenu