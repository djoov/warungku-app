import { getOrderCollection } from "../models/orderModel.js";
import { getUserCollection } from "../models/userModel.js";
import { getRecipeCollection } from "../models/recipeModel.js";
import { getIngredientCollection } from "../models/ingredientModel.js";
import midtransClient from "midtrans-client";

// Lazy initialization to ensure dotenv has loaded
let snap = null;
const getSnap = () => {
    if (!snap) {
        const serverKey = process.env.MIDTRANS_SERVER_KEY;
        snap = new midtransClient.Snap({
            isProduction: false,
            serverKey: serverKey
        });
    }
    return snap;
};

// placing user order for frontend
const placeOrder = async (req, res) => {
    try {
        const newOrder = {
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            status: "Waiting Payment",
            date: Date.now(),
            payment: false 
        };

        const docRef = await getOrderCollection().add(newOrder);

        // Create Snap API parameter
        let parameter = {
            transaction_details: {
                order_id: docRef.id,
                gross_amount: req.body.amount
            },
            credit_card: {
                secure: true
            },
            customer_details: {
                first_name: req.body.address.firstName,
                last_name: req.body.address.lastName,
                email: req.body.address.email,
                phone: req.body.address.phone
            },
            expiry: {
                unit: "minutes",
                duration: 30  // Batas waktu pembayaran: 30 menit
            }
        };

        const transaction = await getSnap().createTransaction(parameter);

        res.json({ success: true, token: transaction.token, orderId: docRef.id });

    } catch (error) {
        console.log("Midtrans error:", error);
        res.status(500).json({ success: false, message: "Error placing order via gateway" });
    }
}

// user orders for frontend
const userOrders = async (req, res) => {
    try {
        const snapshot = await getOrderCollection().where("userId", "==", req.body.userId).get();
        const orders = snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error" });
    }
}

// Listing orders for admin panel
const listOrders = async (req, res) => {
    try {
        const snapshot = await getOrderCollection().get();
        const orders = snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error" });
    }
}

// api for updating order status
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        const orderRef = getOrderCollection().doc(orderId);
        const orderDoc = await orderRef.get();

        if (!orderDoc.exists) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        const orderData = orderDoc.data();
        const previousStatus = orderData.status;

        // Auto-deduct ingredient stock when status changes to "Food Processing"
        if (status === "Food Processing" && previousStatus !== "Food Processing") {
            try {
                for (const item of orderData.items) {
                    const foodId = item._id;
                    const quantity = item.quantity || 1;

                    // Find recipe for this food item
                    const recipeSnap = await getRecipeCollection().where("foodId", "==", foodId).get();
                    if (recipeSnap.empty) continue;

                    const recipe = recipeSnap.docs[0].data();

                    // Deduct each ingredient
                    for (const ing of recipe.ingredients) {
                        const ingRef = getIngredientCollection().doc(ing.ingredientId);
                        const ingDoc = await ingRef.get();
                        if (!ingDoc.exists) continue;

                        const currentStock = ingDoc.data().stock || 0;
                        const deduction = ing.quantity * quantity;
                        const newStock = Math.max(0, currentStock - deduction);

                        await ingRef.update({ stock: newStock, updatedAt: Date.now() });
                    }
                }
                console.log(`[ERP] Stock deducted for order ${orderId}`);
            } catch (stockError) {
                console.log("[ERP] Stock deduction warning:", stockError.message);
                // Don't block order status update if stock deduction fails
            }
        }

        await orderRef.update({ status });
        res.json({ success: true, message: "Status Updated" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error" });
    }
}

// verify order payment status
const verifyOrder = async (req, res) => {
    try {
        const { orderId, success } = req.body;
        if (success === "true" || success === true) {
            await getOrderCollection().doc(orderId).update({ payment: true, status: "Food Processing" });
            
            // Clear user cart only after payment is successful
            const orderDoc = await getOrderCollection().doc(orderId).get();
            if (orderDoc.exists) {
                const userId = orderDoc.data().userId;
                await getUserCollection().doc(userId).update({ cartData: {} });
            }

            res.json({ success: true, message: "Paid" });
        } else {
            // Don't delete! Just keep as "Waiting Payment"
            await getOrderCollection().doc(orderId).update({ status: "Waiting Payment" });
            res.json({ success: false, message: "Payment pending" });
        }
    } catch (error) {
        console.log("Verify error:", error);
        res.status(500).json({ success: false, message: "Error verifying payment" });
    }
}

// retry payment for unpaid orders
const retryPayment = async (req, res) => {
    try {
        const { orderId } = req.body;
        const orderDoc = await getOrderCollection().doc(orderId).get();
        
        if (!orderDoc.exists) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        const order = orderDoc.data();

        if (order.payment === true) {
            return res.json({ success: false, message: "Order already paid" });
        }

        // Create new Snap transaction with unique order_id
        let parameter = {
            transaction_details: {
                order_id: orderId + "-retry-" + Date.now(),
                gross_amount: order.amount
            },
            credit_card: { secure: true },
            customer_details: {
                first_name: order.address.firstName,
                last_name: order.address.lastName,
                email: order.address.email,
                phone: order.address.phone
            },
            expiry: {
                unit: "minutes",
                duration: 30
            }
        };

        const transaction = await getSnap().createTransaction(parameter);
        res.json({ success: true, token: transaction.token, orderId: orderId });

    } catch (error) {
        console.log("Retry payment error:", error);
        res.status(500).json({ success: false, message: "Error creating payment" });
    }
}

// POS (Point of Sale) - Cashier walk-in order
const posOrder = async (req, res) => {
    try {
        const { items, amount, paymentMethod, customerName } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: "No items in order" });
        }

        const newOrder = {
            userId: "POS",
            items,
            amount,
            address: {
                firstName: customerName || "Walk-in",
                lastName: "Customer",
                street: "Dine-in / Takeaway",
                city: "-", state: "-", country: "-", zipcode: "-",
                phone: "-", email: "-"
            },
            status: "Food Processing",
            date: Date.now(),
            payment: true,
            paymentMethod: paymentMethod || "cash",
            source: "pos"
        };

        const docRef = await getOrderCollection().add(newOrder);

        // Auto-deduct ingredient stock immediately
        try {
            for (const item of items) {
                const foodId = item._id;
                const quantity = item.quantity || 1;

                const recipeSnap = await getRecipeCollection().where("foodId", "==", foodId).get();
                if (recipeSnap.empty) continue;

                const recipe = recipeSnap.docs[0].data();

                for (const ing of recipe.ingredients) {
                    const ingRef = getIngredientCollection().doc(ing.ingredientId);
                    const ingDoc = await ingRef.get();
                    if (!ingDoc.exists) continue;

                    const currentStock = ingDoc.data().stock || 0;
                    const deduction = ing.quantity * quantity;
                    const newStock = Math.max(0, currentStock - deduction);

                    await ingRef.update({ stock: newStock, updatedAt: Date.now() });
                }
            }
            console.log(`[POS] Stock deducted for order ${docRef.id}`);
        } catch (stockError) {
            console.log("[POS] Stock deduction warning:", stockError.message);
        }

        res.json({ success: true, message: "Order placed successfully", orderId: docRef.id });

    } catch (error) {
        console.log("POS error:", error);
        res.status(500).json({ success: false, message: "Error placing POS order" });
    }
}

export { placeOrder, userOrders, listOrders, updateStatus, verifyOrder, retryPayment, posOrder }