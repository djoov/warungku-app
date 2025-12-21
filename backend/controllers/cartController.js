import userModel from "../models/userModel.js";

// add items to user cart 
const addToCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId)//the user id is from the middleware the we decode it and delte it;
        let cartData = await userData.cartData;
        if (!cartData[req.body.itemId]) {
            cartData[req.body.itemId] = 1;//basicly this it the add to cart functionality so if u add the card the mongo db cart data will get increased 
        }
        else {
            cartData[req.body.itemId] += 1;//and this one is for if u add the cart again that means it plus 2 so that means in the mongo db the data get increased into two test this in the postman
        }
        await userModel.findByIdAndUpdate(req.body.userId,{cartData:cartData});
        res.json({success:true,message:"Item Added To Cart"});
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"});
        
    }
}

//remove items from user cart 
const removeFromCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);//the user id is from the middleware the we decode it and delte it
        let cartData = await userData.cartData;
        if (cartData[req.body.itemId]>0) { //lets check if the item is in the cart or nah
            cartData[req.body.itemId] -= 1;//if its in the cart then minus 1
            
        }
        await userModel.findByIdAndUpdate(req.body.userId,{cartData});
        res.json({success:true,message:"Item Removed From Cart"});
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"});
        
    }
}

// fetch user cart 
const getCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);//the user id is from the middleware the we decode it and delte it
        let cartData = await userData.cartData;
        res.json({success:true,cartData});
    } catch (error) {
       console.log(error);
       res.json({success:false,message:"Error"});
        
    }
}

export {addToCart, removeFromCart, getCart}