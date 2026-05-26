import React, { useEffect, useState } from 'react';
import './Recipes.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const Recipes = ({ url, token }) => {
    const [foods, setFoods] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [selectedFood, setSelectedFood] = useState(null);
    const [recipeIngredients, setRecipeIngredients] = useState([]);
    const [portions, setPortions] = useState(null);
    const [showEditor, setShowEditor] = useState(false);

    const fetchAll = async () => {
        try {
            const [foodRes, ingRes, recipeRes] = await Promise.all([
                axios.get(url + "/api/food/list"),
                axios.get(url + "/api/ingredient/list", { headers: { token } }),
                axios.get(url + "/api/recipe/list", { headers: { token } })
            ]);
            if (foodRes.data.success) setFoods(foodRes.data.data);
            if (ingRes.data.success) setIngredients(ingRes.data.data);
            if (recipeRes.data.success) setRecipes(recipeRes.data.data);
        } catch (e) {
            toast.error("Gagal memuat data");
        }
    };

    useEffect(() => { if (token) fetchAll(); }, [token]);

    const openRecipeEditor = async (food) => {
        setSelectedFood(food);
        setShowEditor(true);
        setPortions(null);

        try {
            const res = await axios.get(url + `/api/recipe/get/${food._id}`, { headers: { token } });
            if (res.data.success && res.data.data) {
                setRecipeIngredients(res.data.data.ingredients.map(i => ({
                    ingredientId: i.ingredientId,
                    quantity: i.quantity
                })));
            } else {
                setRecipeIngredients([]);
            }

            const portionRes = await axios.get(url + `/api/recipe/portions/${food._id}`, { headers: { token } });
            if (portionRes.data.success) setPortions(portionRes.data.portions);
        } catch (e) {
            setRecipeIngredients([]);
        }
    };

    const addIngredientRow = () => {
        setRecipeIngredients([...recipeIngredients, { ingredientId: '', quantity: '' }]);
    };

    const removeIngredientRow = (index) => {
        setRecipeIngredients(recipeIngredients.filter((_, i) => i !== index));
    };

    const updateIngredientRow = (index, field, value) => {
        const updated = [...recipeIngredients];
        updated[index][field] = value;
        setRecipeIngredients(updated);
    };

    const saveRecipe = async () => {
        const validIngredients = recipeIngredients.filter(i => i.ingredientId && i.quantity > 0);
        if (validIngredients.length === 0) {
            toast.error("Tambahkan minimal 1 bahan");
            return;
        }
        try {
            const res = await axios.post(url + "/api/recipe/set", {
                foodId: selectedFood._id,
                ingredients: validIngredients
            }, { headers: { token } });
            if (res.data.success) {
                toast.success(res.data.message);
                fetchAll();
                // Refresh portions
                const portionRes = await axios.get(url + `/api/recipe/portions/${selectedFood._id}`, { headers: { token } });
                if (portionRes.data.success) setPortions(portionRes.data.portions);
            }
        } catch (e) {
            toast.error("Gagal menyimpan resep");
        }
    };

    const getRecipeForFood = (foodId) => recipes.find(r => r.foodId === foodId);
    const getIngredientName = (id) => ingredients.find(i => i._id === id)?.name || 'Unknown';
    const getIngredientUnit = (id) => ingredients.find(i => i._id === id)?.unit || '';

    return (
        <div className="recipes-page saas-dashboard">
            <div className="dashboard-header">
                <div className="header-title">
                    <h2>Recipes Configuration</h2>
                    <p>Map ingredients to menu items for automatic stock deduction</p>
                </div>
            </div>

            <div className="recipes-layout">
                {/* Food list */}
                <div className="saas-panel food-list-panel">
                    <div className="panel-header">
                        <h3>Menu Items ({foods.length})</h3>
                    </div>
                    <div className="recipe-food-items">
                        {foods.map(food => {
                            const recipe = getRecipeForFood(food._id);
                            return (
                                <div
                                    key={food._id}
                                    className={`recipe-food-item ${selectedFood?._id === food._id ? 'selected' : ''}`}
                                    onClick={() => openRecipeEditor(food)}
                                >
                                    <img src={food.image} alt={food.name} />
                                    <div className="recipe-food-item-info">
                                        <p className="recipe-food-item-name">{food.name}</p>
                                        <p className="recipe-food-item-category">{food.category}</p>
                                    </div>
                                    <span className={`saas-badge ${recipe ? 'delivered' : 'waiting-payment'}`}>
                                        {recipe ? `${recipe.ingredients.length} mapped` : 'Unmapped'}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Recipe editor */}
                <div className="saas-panel recipe-editor-panel">
                    {!showEditor ? (
                        <div className="editor-empty">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="15" y2="16"/></svg>
                            <p>Select a menu item from the list to view or edit its recipe mapping.</p>
                        </div>
                    ) : (
                        <div className="editor-content">
                            <div className="panel-header" style={{borderBottom: 'none', paddingBottom: 0}}>
                                <div>
                                    <h3 style={{fontSize: '18px'}}>{selectedFood.name}</h3>
                                    <p className="text-muted" style={{fontSize: '13px', marginTop:'4px'}}>Selling Price: Rp {selectedFood.price.toLocaleString('id-ID')}</p>
                                </div>
                                {portions !== null && portions !== undefined && (
                                    <div className={`portions-badge ${portions <= 5 ? 'low' : ''}`}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>
                                        <span>{portions} portions available</span>
                                    </div>
                                )}
                            </div>

                            <div className="ingredient-rows">
                                {recipeIngredients.length === 0 && (
                                    <p className="no-ingredients">No ingredients mapped yet. Click "Add Ingredient" below.</p>
                                )}
                                {recipeIngredients.map((item, idx) => (
                                    <div key={idx} className="ingredient-row form-row">
                                        <select
                                            className="saas-select"
                                            style={{flex: 2}}
                                            value={item.ingredientId}
                                            onChange={(e) => updateIngredientRow(idx, 'ingredientId', e.target.value)}
                                        >
                                            <option value="">-- Select Ingredient --</option>
                                            {ingredients.map(ing => (
                                                <option key={ing._id} value={ing._id}>
                                                    {ing.name} ({ing.stock} {ing.unit} in stock)
                                                </option>
                                            ))}
                                        </select>
                                        <div className="qty-input" style={{flex: 1, display: 'flex', position: 'relative'}}>
                                            <input
                                                className="saas-input"
                                                style={{width: '100%', paddingRight: '45px'}}
                                                type="number"
                                                min="0.01"
                                                step="0.01"
                                                placeholder="Amount"
                                                value={item.quantity}
                                                onChange={(e) => updateIngredientRow(idx, 'quantity', e.target.value)}
                                            />
                                            <span className="qty-unit">{getIngredientUnit(item.ingredientId)}</span>
                                        </div>
                                        <button className="action-btn delete" onClick={() => removeIngredientRow(idx)}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="form-actions" style={{padding: '24px', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', background: '#f8fafc', margin: 'auto -24px -24px -24px'}}>
                                <button className="saas-btn secondary" onClick={addIngredientRow}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                    Add Ingredient
                                </button>
                                <button className="saas-btn primary" onClick={saveRecipe}>Save Configuration</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Recipes;
