import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"
import userRouter from "./routes/userRoute.js"
import 'dotenv/config.js'
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"
import ingredientRouter from "./routes/ingredientRoute.js"
import recipeRouter from "./routes/recipeRoute.js"

//app config
const app = express()
const port = process.env.PORT || 4000

//middlewares
app.use(express.json())
app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true
}))

//firebase connection
connectDB();

//api endpoints
app.use("/api/food", foodRouter)
app.use("/api/user", userRouter)
app.use("/api/cart", cartRouter)
app.use("/api/order", orderRouter)
app.use("/api/ingredient", ingredientRouter)
app.use("/api/recipe", recipeRouter)

app.get("/", (req, res) => {
    res.send("API Working - Firebase Connected 🔥")
})

if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Listening to requests on http://localhost:${port}`)
    })
}

export default app;