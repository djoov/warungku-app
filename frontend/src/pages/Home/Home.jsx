import React, { useState } from 'react'
import './Home.css'
import Header from '../../components/Header/Header'
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu'
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay'
import Testimonials from '../../components/Testimonials/Testimonials'
import AppDownload from '../../components/AppDownload/AppDownload'
import { useNavigate } from 'react-router-dom'

const Home = () => {
    
    const[category,setCategory] = useState("All");
    const navigate = useNavigate();

  return (
    <div>
        <Header/>
        <ExploreMenu category={category} setCategory={setCategory}/>
        <FoodDisplay category={category} limit={8} />
        <div style={{display: 'flex', justifyContent: 'center', marginTop: '30px'}}>
            <button onClick={() => navigate('/menu')} style={{padding: '12px 30px', fontSize: '16px', backgroundColor: 'tomato', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600'}}>View Full Menu</button>
        </div>
        <Testimonials />
        <AppDownload/>
    </div>
  )
}

export default Home