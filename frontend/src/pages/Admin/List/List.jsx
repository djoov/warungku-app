import React, { useEffect, useState } from 'react'
import './List.css'
import axios from "axios"
import {toast} from "react-toastify"

const List = ({url, token}) => { 
  const [list, setList] = useState([]);
  const [editItem, setEditItem] = useState(null); // null = modal closed
  const [editData, setEditData] = useState({ name: '', description: '', price: '', category: '' });
  const [editImage, setEditImage] = useState(null);

  const fetchList = async () =>{
     try {
         const response = await axios.get(`${url}/api/food/list`);
         if(response.data.success){
          setList(response.data.data)
         } else {
            toast.error("Error fetching list")
         }
     } catch(e) {
         toast.error("Error connecting to server")
     }
  }

  const removeFood = async (foodId) =>{
    if (!window.confirm("Yakin ingin menghapus menu ini?")) return;
    try {
        const response = await axios.post(`${url}/api/food/remove`, {id:foodId}, { headers: { token } });
        await fetchList();
        if (response.data.success) toast.success(response.data.message);
        else toast.error("Error");
    } catch(e) {
        toast.error("Error removing food (Unauthorized?)")
    }
  }

  const toggleStock = async (foodId) => {
    try {
        const response = await axios.post(`${url}/api/food/toggle-stock`, { id: foodId }, { headers: { token } });
        if (response.data.success) {
            toast.success(response.data.message);
            await fetchList();
        } else {
            toast.error("Error toggling stock");
        }
    } catch (e) {
        toast.error("Error toggling stock (Unauthorized?)");
    }
  }

  const openEdit = (item) => {
    setEditItem(item);
    setEditData({
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category
    });
    setEditImage(null);
  }

  const submitEdit = async (e) => {
    e.preventDefault();
    if (Number(editData.price) <= 0) {
        toast.error("Harga harus lebih dari Rp 0");
        return;
    }
    try {
        const formData = new FormData();
        formData.append("id", editItem._id);
        formData.append("name", editData.name);
        formData.append("description", editData.description);
        formData.append("price", Number(editData.price));
        formData.append("category", editData.category);
        if (editImage) formData.append("image", editImage);

        const response = await axios.post(`${url}/api/food/update`, formData, { headers: { token } });
        if (response.data.success) {
            toast.success(response.data.message);
            setEditItem(null);
            await fetchList();
        } else {
            toast.error(response.data.message);
        }
    } catch (e) {
        toast.error("Error updating food");
    }
  }

  useEffect(()=>{
    fetchList();
  },[])

  return (
    <div className='list saas-dashboard'>
      <div className="dashboard-header">
          <div className="header-title">
              <h2>Menu Items</h2>
              <p>Manage your food catalog, pricing, and availability</p>
          </div>
          <div className="header-actions">
              <button className="saas-btn primary" onClick={() => window.location.href='/admin/add'}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Add Item
              </button>
          </div>
      </div>
      
      <div className="saas-panel">
          <div className="data-table-container">
              {list.length === 0 ? (
                  <div className="empty-state">
                      <h3>No items found</h3>
                      <p>Your catalog is currently empty.</p>
                  </div>
              ) : (
                  <table className="saas-table">
                      <thead>
                          <tr>
                              <th>Image</th>
                              <th>Name</th>
                              <th>Category</th>
                              <th>Price</th>
                              <th>Status</th>
                              <th style={{textAlign: 'right'}}>Action</th>
                          </tr>
                      </thead>
                      <tbody>
                          {list.map((item, index) => (
                              <tr key={index} className={item.isAvailable === false ? 'opacity-50' : ''}>
                                  <td><img src={item.image} alt="" className="table-img" /></td>
                                  <td className="font-medium">{item.name}</td>
                                  <td>{item.category}</td>
                                  <td>Rp {item.price.toLocaleString('id-ID')}</td>
                                  <td>
                                      <button 
                                          onClick={() => toggleStock(item._id)} 
                                          className={`status-toggle-btn ${item.isAvailable !== false ? 'available' : 'empty'}`}
                                      >
                                          {item.isAvailable !== false ? 'In Stock' : 'Out of Stock'}
                                      </button>
                                  </td>
                                  <td style={{textAlign: 'right'}}>
                                      <div className="action-buttons">
                                          <button onClick={() => openEdit(item)} className="action-btn edit" title="Edit">
                                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                          </button>
                                          <button onClick={() => removeFood(item._id)} className="action-btn delete" title="Delete">
                                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                                          </button>
                                      </div>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              )}
          </div>
      </div>

      {/* Edit Modal */}
      {editItem && (
        <div className="modal-overlay" onClick={() => setEditItem(null)}>
            <div className="modal-content saas-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Edit Menu Item</h3>
                    <button className="close-btn" onClick={() => setEditItem(null)}>&times;</button>
                </div>
                <form onSubmit={submitEdit} className="saas-form">
                    <div className="form-group">
                        <label>Name</label>
                        <input className="saas-input" value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} required />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea className="saas-input" value={editData.description} onChange={(e) => setEditData({...editData, description: e.target.value})} rows="3" required></textarea>
                    </div>
                    <div className="form-row-2">
                        <div className="form-group">
                            <label>Category</label>
                            <select className="saas-select" value={editData.category} onChange={(e) => setEditData({...editData, category: e.target.value})}>
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
                        <div className="form-group">
                            <label>Price (Rp)</label>
                            <input className="saas-input" type="number" value={editData.price} onChange={(e) => setEditData({...editData, price: e.target.value})} required />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Update Image (Optional)</label>
                        <input className="saas-input file-input" type="file" onChange={(e) => setEditImage(e.target.files[0])} />
                    </div>
                    <div className="form-actions" style={{marginTop: '24px'}}>
                        <button type="button" className="saas-btn secondary" onClick={() => setEditItem(null)}>Cancel</button>
                        <button type="submit" className="saas-btn primary">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  )
}

export default List