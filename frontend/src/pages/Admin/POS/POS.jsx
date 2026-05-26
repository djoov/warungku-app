import React, { useEffect, useState } from 'react';
import './POS.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const POS = ({ url, token }) => {
    const [foods, setFoods] = useState([]);
    const [cart, setCart] = useState([]);
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [customerName, setCustomerName] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [lastOrder, setLastOrder] = useState(null);

    const categories = ['All', 'Nasi', 'Mie', 'Ayam', 'Soto', 'Bakso', 'Sayur', 'Minuman', 'Snack'];

    useEffect(() => {
        const fetchFoods = async () => {
            try {
                const res = await axios.get(url + "/api/food/list");
                if (res.data.success) setFoods(res.data.data.filter(f => f.isAvailable !== false));
            } catch (e) {
                toast.error("Failed to load menu");
            }
        };
        fetchFoods();
    }, [url]);

    const addToCart = (food) => {
        const exists = cart.find(c => c._id === food._id);
        if (exists) {
            setCart(cart.map(c => c._id === food._id ? { ...c, quantity: c.quantity + 1 } : c));
        } else {
            setCart([...cart, { _id: food._id, name: food.name, price: food.price, quantity: 1 }]);
        }
    };

    const updateQuantity = (id, delta) => {
        setCart(cart.map(c => {
            if (c._id === id) {
                const newQty = c.quantity + delta;
                return newQty <= 0 ? null : { ...c, quantity: newQty };
            }
            return c;
        }).filter(Boolean));
    };

    const removeItem = (id) => setCart(cart.filter(c => c._id !== id));

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    const submitOrder = async () => {
        if (cart.length === 0) { toast.error("Cart is empty"); return; }
        setIsSubmitting(true);
        try {
            const res = await axios.post(url + "/api/order/pos", {
                items: cart,
                amount: total,
                paymentMethod,
                customerName: customerName || "Walk-in"
            }, { headers: { token } });

            if (res.data.success) {
                toast.success("Order placed! #" + res.data.orderId.substring(0, 8));
                setLastOrder({ id: res.data.orderId, items: [...cart], total, method: paymentMethod, name: customerName || "Walk-in", time: new Date() });
                setCart([]);
                setCustomerName('');
            } else {
                toast.error(res.data.message);
            }
        } catch (e) {
            toast.error("Failed to place order");
        }
        setIsSubmitting(false);
    };

    const filtered = foods.filter(f => {
        const matchCat = activeCategory === 'All' || f.category === activeCategory;
        const matchSearch = f.name.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
    });

    return (
        <div className="pos-page">
            {/* Left Panel: Menu */}
            <div className="pos-menu-panel">
                <div className="pos-menu-header">
                    <h2>Point of Sale</h2>
                    <div className="pos-search">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                        <input
                            type="text"
                            placeholder="Search menu..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="pos-categories">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`pos-cat-btn ${activeCategory === cat ? 'active' : ''}`}
                            onClick={() => setActiveCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="pos-menu-grid">
                    {filtered.length === 0 ? (
                        <p className="pos-empty">No items found.</p>
                    ) : (
                        filtered.map(food => (
                            <div key={food._id} className="pos-menu-item" onClick={() => addToCart(food)}>
                                <img src={food.image} alt={food.name} />
                                <div className="pos-menu-item-info">
                                    <span className="pos-menu-item-name">{food.name}</span>
                                    <span className="pos-menu-item-price">Rp {food.price.toLocaleString('id-ID')}</span>
                                </div>
                                <div className="pos-add-badge">+</div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Right Panel: Cart */}
            <div className="pos-cart-panel">
                <div className="pos-cart-header">
                    <h3>Current Order</h3>
                    {cart.length > 0 && (
                        <button className="pos-clear-btn" onClick={() => setCart([])}>Clear</button>
                    )}
                </div>

                <div className="pos-customer-row">
                    <label>Customer</label>
                    <input
                        className="saas-input"
                        type="text"
                        placeholder="Walk-in Customer"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                    />
                </div>

                <div className="pos-cart-items">
                    {cart.length === 0 ? (
                        <div className="pos-cart-empty">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                            <p>Tap menu items to add</p>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item._id} className="pos-cart-item">
                                <div className="pos-cart-item-info">
                                    <span className="pos-cart-item-name">{item.name}</span>
                                    <span className="pos-cart-item-price">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                                </div>
                                <div className="pos-cart-item-actions">
                                    <button className="pos-qty-btn" onClick={() => updateQuantity(item._id, -1)}>−</button>
                                    <span className="pos-qty-value">{item.quantity}</span>
                                    <button className="pos-qty-btn" onClick={() => updateQuantity(item._id, 1)}>+</button>
                                    <button className="pos-remove-btn" onClick={() => removeItem(item._id)}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="pos-cart-footer">
                    <div className="pos-summary">
                        <div className="pos-summary-row">
                            <span>Items</span>
                            <span>{totalItems}</span>
                        </div>
                        <div className="pos-summary-row total">
                            <span>Total</span>
                            <span>Rp {total.toLocaleString('id-ID')}</span>
                        </div>
                    </div>

                    <div className="pos-payment-methods">
                        <button className={`pos-pay-btn ${paymentMethod === 'cash' ? 'active' : ''}`} onClick={() => setPaymentMethod('cash')}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/></svg>
                            Cash
                        </button>
                        <button className={`pos-pay-btn ${paymentMethod === 'qris' ? 'active' : ''}`} onClick={() => setPaymentMethod('qris')}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="3" height="3"/></svg>
                            QRIS
                        </button>
                    </div>

                    <button
                        className={`pos-submit-btn ${cart.length === 0 || isSubmitting ? 'disabled' : ''}`}
                        onClick={submitOrder}
                        disabled={cart.length === 0 || isSubmitting}
                    >
                        {isSubmitting ? 'Processing...' : `Charge Rp ${total.toLocaleString('id-ID')}`}
                    </button>
                </div>

                {/* Last Order Receipt */}
                {lastOrder && (
                    <div className="pos-receipt">
                        <div className="pos-receipt-header">
                            <span>Last Order</span>
                            <span className="font-mono">#{lastOrder.id.substring(0, 8)}</span>
                        </div>
                        <div className="pos-receipt-body">
                            <p>{lastOrder.name} • {lastOrder.method.toUpperCase()}</p>
                            <p className="font-medium">Rp {lastOrder.total.toLocaleString('id-ID')}</p>
                            <p className="text-muted">{lastOrder.time.toLocaleTimeString()}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default POS;
