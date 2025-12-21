import mongoose from "mongoose";

export const connectDB = async () => {
    await await mongoose.connect('mongodb+srv://eclips:CLakpUfbycn0xf5C@cluster0.6dlqmjn.mongodb.net/food-del').then(()=>console.log("DB Connected"));
}