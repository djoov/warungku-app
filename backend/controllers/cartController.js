import { getUserCollection } from "../models/userModel.js";

// add items to user cart
const addToCart = async (req, res) => {
    try {
        const userRef = getUserCollection().doc(req.body.userId);
        const userDoc = await userRef.get();
        
        if (!userDoc.exists) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        let userData = userDoc.data();
        let cartData = userData.cartData || {};

        if (!cartData[req.body.itemId]) {
            cartData[req.body.itemId] = 1;
        } else {
            cartData[req.body.itemId] += 1;
        }

        await userRef.update({ cartData });
        res.json({ success: true, message: "Added To Cart" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error" });
    }
}

// remove items from user cart
const removeFromCart = async (req, res) => {
    try {
        const userRef = getUserCollection().doc(req.body.userId);
        const userDoc = await userRef.get();
        
        if (!userDoc.exists) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        let userData = userDoc.data();
        let cartData = userData.cartData || {};

        if (cartData[req.body.itemId] > 0) {
            cartData[req.body.itemId] -= 1;
        }

        await userRef.update({ cartData });
        res.json({ success: true, message: "Removed From Cart" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error" });
    }
}

// fetch user cart data
const getCart = async (req, res) => {
    try {
        const userRef = getUserCollection().doc(req.body.userId);
        const userDoc = await userRef.get();
        
        if (!userDoc.exists) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        let userData = userDoc.data();
        let cartData = userData.cartData || {};
        
        res.json({ success: true, cartData });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error" });
    }
}

export { addToCart, removeFromCart, getCart }