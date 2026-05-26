import { getRecipeCollection } from "../models/recipeModel.js";
import { getIngredientCollection } from "../models/ingredientModel.js";
import { getFoodCollection } from "../models/foodModel.js";

// Set/update resep untuk menu tertentu
const setRecipe = async (req, res) => {
    try {
        const { foodId, ingredients } = req.body;
        // ingredients = [{ ingredientId, quantity }, ...]

        if (!foodId || !ingredients || !Array.isArray(ingredients)) {
            return res.status(400).json({ success: false, message: "foodId dan ingredients wajib diisi" });
        }

        // Verifikasi food exists
        const foodDoc = await getFoodCollection().doc(foodId).get();
        if (!foodDoc.exists) {
            return res.status(404).json({ success: false, message: "Menu tidak ditemukan" });
        }

        // Check if recipe already exists for this food
        const existing = await getRecipeCollection().where("foodId", "==", foodId).get();

        const recipeData = {
            foodId,
            foodName: foodDoc.data().name,
            ingredients: ingredients.map(i => ({
                ingredientId: i.ingredientId,
                quantity: Number(i.quantity)
            })),
            updatedAt: Date.now()
        };

        if (!existing.empty) {
            // Update existing recipe
            await getRecipeCollection().doc(existing.docs[0].id).update(recipeData);
            res.json({ success: true, message: "Resep diperbarui" });
        } else {
            // Create new recipe
            recipeData.createdAt = Date.now();
            await getRecipeCollection().add(recipeData);
            res.json({ success: true, message: "Resep ditambahkan" });
        }

    } catch (error) {
        console.log("Set recipe error:", error);
        res.status(500).json({ success: false, message: "Gagal menyimpan resep" });
    }
};

// Get resep untuk menu tertentu
const getRecipe = async (req, res) => {
    try {
        const { foodId } = req.params;

        const snapshot = await getRecipeCollection().where("foodId", "==", foodId).get();

        if (snapshot.empty) {
            return res.json({ success: true, data: null, message: "Belum ada resep untuk menu ini" });
        }

        const recipe = { _id: snapshot.docs[0].id, ...snapshot.docs[0].data() };

        // Enrich with ingredient names
        const enrichedIngredients = [];
        for (const item of recipe.ingredients) {
            const ingDoc = await getIngredientCollection().doc(item.ingredientId).get();
            enrichedIngredients.push({
                ...item,
                name: ingDoc.exists ? ingDoc.data().name : "Unknown",
                unit: ingDoc.exists ? ingDoc.data().unit : "",
                currentStock: ingDoc.exists ? ingDoc.data().stock : 0
            });
        }
        recipe.ingredients = enrichedIngredients;

        res.json({ success: true, data: recipe });

    } catch (error) {
        console.log("Get recipe error:", error);
        res.status(500).json({ success: false, message: "Gagal memuat resep" });
    }
};

// List semua resep (untuk admin overview)
const listRecipes = async (req, res) => {
    try {
        const snapshot = await getRecipeCollection().get();
        const recipes = snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
        res.json({ success: true, data: recipes });
    } catch (error) {
        console.log("List recipes error:", error);
        res.status(500).json({ success: false, message: "Gagal memuat daftar resep" });
    }
};

// Hapus resep
const deleteRecipe = async (req, res) => {
    try {
        const { id } = req.body;
        await getRecipeCollection().doc(id).delete();
        res.json({ success: true, message: "Resep dihapus" });
    } catch (error) {
        console.log("Delete recipe error:", error);
        res.status(500).json({ success: false, message: "Gagal menghapus resep" });
    }
};

// Cek berapa porsi bisa dibuat dari stok saat ini
const checkPortions = async (req, res) => {
    try {
        const { foodId } = req.params;

        const snapshot = await getRecipeCollection().where("foodId", "==", foodId).get();
        if (snapshot.empty) {
            return res.json({ success: true, portions: null, message: "Belum ada resep" });
        }

        const recipe = snapshot.docs[0].data();
        let minPortions = Infinity;

        for (const item of recipe.ingredients) {
            const ingDoc = await getIngredientCollection().doc(item.ingredientId).get();
            if (!ingDoc.exists || item.quantity <= 0) continue;

            const available = ingDoc.data().stock || 0;
            const portions = Math.floor(available / item.quantity);
            minPortions = Math.min(minPortions, portions);
        }

        if (minPortions === Infinity) minPortions = 0;

        res.json({ success: true, portions: minPortions });

    } catch (error) {
        console.log("Check portions error:", error);
        res.status(500).json({ success: false, message: "Gagal menghitung porsi" });
    }
};

export { setRecipe, getRecipe, listRecipes, deleteRecipe, checkPortions };
