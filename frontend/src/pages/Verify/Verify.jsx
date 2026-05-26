import React, { useEffect } from 'react'
import './Verify.css'
import { useNavigate } from 'react-router-dom';

const Verify = () => {

    const navigate = useNavigate();

    useEffect(() => {
        // No more Stripe verification needed, redirect to orders
        navigate("/myorders");
    },[])
    
  return (
    <div className='verify'>
        <div className="spinner"></div>
    </div>
  )
}

export default Verify