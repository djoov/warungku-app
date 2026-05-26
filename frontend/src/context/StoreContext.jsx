import { createContext, useEffect, useState } from "react";
import axios from "axios"
export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

    const [cartItems, setCartItems] = useState({});
    const url = import.meta.env.VITE_API_URL || "http://localhost:4000";
    const [token, setToken] = useState("");
    const [userRole, setUserRole] = useState("");
    const [food_list, setFoodList] = useState([])
    const [userProfile, setUserProfile] = useState({})
    const [loading, setLoading] = useState(true);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const fetchUserProfile = async (tokenStr) => {
        try {
            const response = await axios.get(url+"/api/user/profile", {headers:{token: tokenStr}});
            if (response.data.success) {
                setUserProfile(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
        }
    }

    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }))
        }
        else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }))
        }
        if (token) {
            await axios.post(url+"/api/cart/add", {itemId},{headers:{token}})
        }
    }

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }))
        if (token) {
            await axios.post(url+"/api/cart/remove", {itemId},{headers:{token}})
        }
    }

    const getTotalCartAmmount = () => {
        let totalAmmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item);
                if (itemInfo) {
                    totalAmmount += itemInfo.price * cartItems[item];
                }
            }
        }
        return totalAmmount;
    }

    const fetchFoodList = async ()=>{
        try {
            const response = await axios.get(url+"/api/food/list");
            if (response.data.success && response.data.data) {
                setFoodList(response.data.data);
            } else {
                setFoodList([]);
                console.error("Failed to fetch food list:", response.data.message);
            }
        } catch (error) {
            setFoodList([]);
            console.error("Error fetching food list:", error);
        }
    }

    const loadCartData = async (token) =>{
        try {
            const response = await axios.post(url+"/api/cart/get", {}, {headers:{token}});
            if (response.data.success && response.data.cartData) {
                setCartItems(response.data.cartData);
            } else {
                setCartItems({});
            }
        } catch (error) {
            setCartItems({});
            console.error("Error fetching cart data:", error);
        }
    }

    useEffect(()=>{
        async function loadData() {
            await fetchFoodList();
              const savedToken = localStorage.getItem("token");
            if (savedToken) {
                setToken(savedToken);
                const savedRole = localStorage.getItem("userRole");
                if (savedRole) {
                    setUserRole(savedRole);
                }
                await loadCartData(savedToken);
                await fetchUserProfile(savedToken);
            }
            setLoading(false);
        }
        loadData();
    },[])

    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmmount,
        url,
        token,
        setToken,
        userRole,
        setUserRole,
        userProfile,
        setUserProfile,
        fetchUserProfile,
        loading,
        isSidebarCollapsed,
        setIsSidebarCollapsed
    }
    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}
export default StoreContextProvider;