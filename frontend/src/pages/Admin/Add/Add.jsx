import React, {  useState } from 'react'
import './Add.css'
import { assets } from '../../../assets/assets'
import axios from "axios"
import { toast } from 'react-toastify'

const Add = ({url, token}) => {
    const [image,setImage] = useState(false);
    const [data, setData] = useState({
        name:"",
        description:"",
        price:"",
        category:"Nasi"
    })
    const onChangeHandler = (event) =>{
        const name = event.target.name;
        const value = event.target.value;
        setData(data=>({...data,[name]:value}))
    }
    
    const onSubmitHandler = async (event) =>{
        event.preventDefault();

        if (Number(data.price) <= 0) {
            toast.error("Harga harus lebih dari Rp 0");
            return;
        }

        const formData = new FormData();
        formData.append("name",data.name)
        formData.append("description",data.description)
        formData.append("price",Number(data.price))
        formData.append("category",data.category)
        formData.append("image", image)
        
        try {
            const response = await axios.post(`${url}/api/food/add`, formData, { headers: { token } });
            if(response.data.success){
                setData({
                    name:"",
                    description:"",
                    price:"",
                    category:"Nasi"
                })
                setImage(false)
                toast.success(response.data.message)
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            toast.error("Error adding food (Unauthorized?)")
        }
    }

  return (
    <div className='add saas-dashboard'>
        <div className="dashboard-header">
            <div className="header-title">
                <h2>Add Product</h2>
                <p>Create a new menu item for your storefront</p>
            </div>
        </div>

        <div className="saas-panel add-panel">
            <form className='flex-col add-form' onSubmit={onSubmitHandler}>
                <div className="add-img-upload flex-col form-group">
                    <label>Upload Image</label>
                    <label htmlFor="image" className="image-upload-area">
                        <img src={image?URL.createObjectURL(image):assets.upload_area} alt="" className={image ? 'uploaded' : 'placeholder'} />
                    </label>
                    <input onChange={(e)=>setImage(e.target.files[0])} type="file" id="image" hidden required />
                </div>
                
                <div className="form-row">
                    <div className="add-product-name flex-col form-group">
                        <label>Product Name</label>
                        <input className="saas-input" onChange={onChangeHandler} value={data.name} type="text" name='name' placeholder='e.g., Nasi Goreng Spesial' required />                
                    </div>
                </div>

                <div className="add-product-description flex-col form-group">
                    <label>Product Description</label>
                    <textarea className="saas-input" onChange={onChangeHandler} value={data.description} name="description" rows="4" placeholder='Describe the ingredients and flavor...' required></textarea>
                </div>

                <div className="add-category-price form-row-2">
                    <div className="add-category flex-col form-group">
                        <label>Category</label>
                        <select className="saas-select" onChange={onChangeHandler} name="category" >
                            <option value="Nasi">Nasi</option>
                            <option value="Mie">Mie</option>
                            <option value="Ayam">Ayam</option>
                            <option value="Soto">Soto</option>
                            <option value="Bakso">Bakso</option>
                            <option value="Sayur">Sayur</option>
                            <option value="Minuman">Minuman</option>
                            <option value="Snack">Snack</option>
                        </select>
                    </div>
                    <div className="add-price flex-col form-group">
                        <label>Price (Rp)</label>
                        <input className="saas-input" onChange={onChangeHandler} value={data.price} type="Number" name='price' placeholder='25000' required />
                    </div>
                </div>
                
                <div className="form-actions">
                    <button type='submit' className='saas-btn primary'>Publish Product</button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default Add