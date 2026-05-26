import React, { useEffect, useState } from 'react';
import './Inventory.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const Inventory = ({ url, token }) => {
    const [ingredients, setIngredients] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showRestockModal, setShowRestockModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [restockItem, setRestockItem] = useState(null);
    const [restockQty, setRestockQty] = useState('');
    const [form, setForm] = useState({
        id: '', name: '', unit: 'kg', stock: '', minStock: '', pricePerUnit: '', supplier: ''
    });

    const units = ['kg', 'gram', 'liter', 'ml', 'pcs', 'pack', 'butir', 'ikat'];

    const fetchIngredients = async () => {
        try {
            const res = await axios.get(url + "/api/ingredient/list", { headers: { token } });
            if (res.data.success) {
                setIngredients(res.data.data);
            } else {

                toast.error(res.data.message || "Gagal memuat data");
            }
        } catch (e) {

            toast.error("Gagal memuat data bahan baku");
        }
    };

    useEffect(() => { if (token) fetchIngredients(); }, [token]);

    const resetForm = () => {
        setForm({ id: '', name: '', unit: 'kg', stock: '', minStock: '', pricePerUnit: '', supplier: '' });
        setEditMode(false);
    };

    const openAdd = () => { resetForm(); setShowModal(true); };

    const openEdit = (item) => {
        setForm({
            id: item._id, name: item.name, unit: item.unit,
            stock: item.stock, minStock: item.minStock,
            pricePerUnit: item.pricePerUnit, supplier: item.supplier
        });
        setEditMode(true);
        setShowModal(true);
    };

    const openRestock = (item) => {
        setRestockItem(item);
        setRestockQty('');
        setShowRestockModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const endpoint = editMode ? "/api/ingredient/update" : "/api/ingredient/add";
            const res = await axios.post(url + endpoint, form, { headers: { token } });

            if (res.data.success) {
                toast.success(res.data.message);
                setShowModal(false);
                resetForm();
                fetchIngredients();
            } else {
                toast.error(res.data.message || "Gagal menyimpan");
            }
        } catch (e) {
            console.error("Ingredient error:", e);
            toast.error(e.response?.data?.message || "Gagal menyimpan data");
        }
    };

    const handleRestock = async () => {
        if (!restockQty || Number(restockQty) <= 0) {
            toast.error("Masukkan jumlah stok yang valid");
            return;
        }
        try {
            const res = await axios.post(url + "/api/ingredient/restock", {
                id: restockItem._id, addStock: Number(restockQty)
            }, { headers: { token } });
            if (res.data.success) {
                toast.success(res.data.message);
                setShowRestockModal(false);
                fetchIngredients();
            }
        } catch (e) {
            toast.error("Gagal restock");
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Hapus bahan "${name}"?`)) return;
        try {
            const res = await axios.post(url + "/api/ingredient/delete", { id }, { headers: { token } });
            if (res.data.success) {
                toast.success(res.data.message);
                fetchIngredients();
            }
        } catch (e) {
            toast.error("Gagal menghapus");
        }
    };

    const lowStockCount = ingredients.filter(i => i.stock <= i.minStock).length;

    return (
        <div className="inventory-page add">
            <div className="inventory-header">
                <div>
                    <h3>Inventory Bahan Baku</h3>
                    <p className="inventory-subtitle">{ingredients.length} bahan terdaftar</p>
                </div>
                <div className="inventory-header-actions">
                    {lowStockCount > 0 && (
                        <div className="low-stock-alert">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                            <span>{lowStockCount} stok rendah</span>
                        </div>
                    )}
                    <button className="add-btn" onClick={openAdd}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        Tambah Bahan
                    </button>
                </div>
            </div>

            {ingredients.length === 0 ? (
                <div className="empty-state">
                    <h3>Belum Ada Bahan Baku</h3>
                    <p>Mulai dengan menambahkan bahan baku pertama Anda.</p>
                </div>
            ) : (
                <div className="inventory-table-container">
                    <table className="inventory-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Nama Bahan</th>
                                <th>Satuan</th>
                                <th>Stok</th>
                                <th>Min. Stok</th>
                                <th>Harga/Unit</th>
                                <th>Supplier</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ingredients.map((item, idx) => {
                                const isLow = item.stock <= item.minStock;
                                return (
                                    <tr key={item._id} className={isLow ? 'low-stock-row' : ''}>
                                        <td>{idx + 1}</td>
                                        <td className="ingredient-name">{item.name}</td>
                                        <td>{item.unit}</td>
                                        <td>
                                            <span className={`stock-badge ${isLow ? 'low' : 'ok'}`}>
                                                {item.stock}
                                            </span>
                                        </td>
                                        <td>{item.minStock}</td>
                                        <td>Rp {(item.pricePerUnit || 0).toLocaleString('id-ID')}</td>
                                        <td>{item.supplier || '-'}</td>
                                        <td className="action-cell">
                                            <button className="action-btn restock" onClick={() => openRestock(item)} title="Restock">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                                            </button>
                                            <button className="action-btn edit" onClick={() => openEdit(item)} title="Edit">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                            </button>
                                            <button className="action-btn delete" onClick={() => handleDelete(item._id, item.name)} title="Hapus">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>{editMode ? 'Edit Bahan Baku' : 'Tambah Bahan Baku'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-form-grid">
                                <div className="modal-field full">
                                    <label>Nama Bahan</label>
                                    <input required value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="Contoh: Ayam Potong" />
                                </div>
                                <div className="modal-field">
                                    <label>Satuan</label>
                                    <select value={form.unit} onChange={(e) => setForm({...form, unit: e.target.value})}>
                                        {units.map(u => <option key={u} value={u}>{u}</option>)}
                                    </select>
                                </div>
                                <div className="modal-field">
                                    <label>Stok Awal</label>
                                    <input type="number" min="0" step="0.01" value={form.stock} onChange={(e) => setForm({...form, stock: e.target.value})} placeholder="0" />
                                </div>
                                <div className="modal-field">
                                    <label>Min. Stok (Peringatan)</label>
                                    <input type="number" min="0" step="0.01" value={form.minStock} onChange={(e) => setForm({...form, minStock: e.target.value})} placeholder="5" />
                                </div>
                                <div className="modal-field">
                                    <label>Harga per Unit (Rp)</label>
                                    <input type="number" min="0" value={form.pricePerUnit} onChange={(e) => setForm({...form, pricePerUnit: e.target.value})} placeholder="15000" />
                                </div>
                                <div className="modal-field full">
                                    <label>Supplier (Opsional)</label>
                                    <input value={form.supplier} onChange={(e) => setForm({...form, supplier: e.target.value})} placeholder="Nama pemasok" />
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>Batal</button>
                                <button type="submit" className="save-btn">{editMode ? 'Simpan Perubahan' : 'Tambah'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Restock Modal */}
            {showRestockModal && restockItem && (
                <div className="modal-overlay" onClick={() => setShowRestockModal(false)}>
                    <div className="modal-content restock-modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Restock: {restockItem.name}</h3>
                        <p className="restock-current">Stok saat ini: <strong>{restockItem.stock} {restockItem.unit}</strong></p>
                        <div className="modal-field">
                            <label>Jumlah yang ditambahkan ({restockItem.unit})</label>
                            <input type="number" min="0.01" step="0.01" value={restockQty} onChange={(e) => setRestockQty(e.target.value)} placeholder="Masukkan jumlah" autoFocus />
                        </div>
                        {restockQty > 0 && (
                            <p className="restock-preview">Stok baru: <strong>{(restockItem.stock + Number(restockQty))} {restockItem.unit}</strong></p>
                        )}
                        <div className="modal-actions">
                            <button type="button" className="cancel-btn" onClick={() => setShowRestockModal(false)}>Batal</button>
                            <button type="button" className="save-btn" onClick={handleRestock}>Restock</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inventory;
