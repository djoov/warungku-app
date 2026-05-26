import { getFoodCollection } from '../models/foodModel.js';
import { bucket } from '../config/db.js';

// add food item
const addFood = async (req, res) => {
    try {
        let imageUrl = "";

        // If there's a file, upload to Firebase Storage
        if (req.file) {
            const fileName = `${Date.now()}-${req.file.originalname}`;
            const file = bucket.file(`food_images/${fileName}`);
            
            await file.save(req.file.buffer, {
                metadata: { contentType: req.file.mimetype }
            });

            // Make the file publicly accessible and get URL
            await file.makePublic();
            imageUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
        }

        const foodData = {
            name: req.body.name,
            description: req.body.description,
            price: Number(req.body.price),
            category: req.body.category,
            image: imageUrl
        };

        const docRef = await getFoodCollection().add(foodData);
        res.json({ success: true, message: "Food Added", id: docRef.id });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error adding food" });
    }
}

// all food list
const listFood = async (req, res) => {
    try {
        const snapshot = await getFoodCollection().get();
        const foods = snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
        res.json({ success: true, data: foods });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error fetching food list" });
    }
}

// remove food item
const removeFood = async (req, res) => {
    try {
        const foodDoc = await getFoodCollection().doc(req.body.id).get();
        
        if (!foodDoc.exists) {
            return res.status(404).json({ success: false, message: "Food not found" });
        }

        const foodData = foodDoc.data();

        // Delete from storage if image exists
        if (foodData.image) {
            try {
                // Extract filename from URL
                const urlParts = foodData.image.split('/');
                const fileName = urlParts[urlParts.length - 1];
                await bucket.file(`food_images/${fileName}`).delete();
            } catch (storageError) {
                console.log("Storage delete error (might not exist):", storageError.message);
            }
        }

        await getFoodCollection().doc(req.body.id).delete();
        res.json({ success: true, message: "Food Removed" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error removing food" });
    }
}

// update food item
const updateFood = async (req, res) => {
    try {
        const foodRef = getFoodCollection().doc(req.body.id);
        const foodDoc = await foodRef.get();

        if (!foodDoc.exists) {
            return res.status(404).json({ success: false, message: "Food not found" });
        }

        const updateData = {
            name: req.body.name,
            description: req.body.description,
            price: Number(req.body.price),
            category: req.body.category,
        };

        // If new image uploaded, replace old one
        if (req.file) {
            const oldData = foodDoc.data();
            // Delete old image from storage
            if (oldData.image && oldData.image.includes('storage.googleapis.com')) {
                try {
                    const urlParts = oldData.image.split('/');
                    const fileName = urlParts[urlParts.length - 1];
                    await bucket.file(`food_images/${fileName}`).delete();
                } catch (e) {
                    console.log("Old image delete error:", e.message);
                }
            }

            const newFileName = `${Date.now()}-${req.file.originalname}`;
            const file = bucket.file(`food_images/${newFileName}`);
            await file.save(req.file.buffer, {
                metadata: { contentType: req.file.mimetype }
            });
            await file.makePublic();
            updateData.image = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
        }

        await foodRef.update(updateData);
        res.json({ success: true, message: "Food Updated" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error updating food" });
    }
}

// toggle food availability (in stock / out of stock)
const toggleStock = async (req, res) => {
    try {
        const foodRef = getFoodCollection().doc(req.body.id);
        const foodDoc = await foodRef.get();

        if (!foodDoc.exists) {
            return res.status(404).json({ success: false, message: "Food not found" });
        }

        const currentData = foodDoc.data();
        const newAvailability = currentData.available === false ? true : false;

        await foodRef.update({ available: newAvailability });
        res.json({ 
            success: true, 
            message: newAvailability ? "Menu ditandai Tersedia" : "Menu ditandai Habis",
            available: newAvailability 
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error toggling stock" });
    }
}

export { addFood, listFood, removeFood, updateFood, toggleStock }