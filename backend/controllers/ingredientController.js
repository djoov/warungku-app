import { getIngredientCollection } from "../models/ingredientModel.js";

// Tambah bahan baku baru
const addIngredient = async (req, res) => {
    try {
        const { name, unit, stock, minStock, pricePerUnit, supplier } = req.body;

        if (!name || !unit) {
            return res.status(400).json({ success: false, message: "Nama dan satuan wajib diisi" });
        }

        const ingredientData = {
            name,
            unit, // kg, liter, pcs, gram, dll
            stock: Number(stock) || 0,
            minStock: Number(minStock) || 0,
            pricePerUnit: Number(pricePerUnit) || 0,
            supplier: supplier || "",
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

        const docRef = await getIngredientCollection().add(ingredientData);
        res.json({ success: true, message: "Bahan baku ditambahkan", id: docRef.id });

    } catch (error) {
        console.log("Add ingredient error:", error);
        res.status(500).json({ success: false, message: "Gagal menambah bahan baku" });
    }
};

// Daftar semua bahan baku
const listIngredients = async (req, res) => {
    try {
        const snapshot = await getIngredientCollection().get();
        const ingredients = snapshot.docs
            .map(doc => ({ _id: doc.id, ...doc.data() }))
            .sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        res.json({ success: true, data: ingredients });
    } catch (error) {
        console.log("List ingredients error:", error);
        res.status(500).json({ success: false, message: "Gagal memuat daftar bahan" });
    }
};

// Update bahan baku
const updateIngredient = async (req, res) => {
    try {
        const { id, name, unit, stock, minStock, pricePerUnit, supplier } = req.body;

        if (!id) {
            return res.status(400).json({ success: false, message: "ID bahan wajib diisi" });
        }

        const ref = getIngredientCollection().doc(id);
        const doc = await ref.get();

        if (!doc.exists) {
            return res.status(404).json({ success: false, message: "Bahan baku tidak ditemukan" });
        }

        const updateData = {
            ...(name && { name }),
            ...(unit && { unit }),
            ...(stock !== undefined && { stock: Number(stock) }),
            ...(minStock !== undefined && { minStock: Number(minStock) }),
            ...(pricePerUnit !== undefined && { pricePerUnit: Number(pricePerUnit) }),
            ...(supplier !== undefined && { supplier }),
            updatedAt: Date.now()
        };

        await ref.update(updateData);
        res.json({ success: true, message: "Bahan baku diperbarui" });

    } catch (error) {
        console.log("Update ingredient error:", error);
        res.status(500).json({ success: false, message: "Gagal memperbarui bahan baku" });
    }
};

// Hapus bahan baku
const deleteIngredient = async (req, res) => {
    try {
        const { id } = req.body;
        
        if (!id) {
            return res.status(400).json({ success: false, message: "ID bahan wajib diisi" });
        }

        const ref = getIngredientCollection().doc(id);
        const doc = await ref.get();

        if (!doc.exists) {
            return res.status(404).json({ success: false, message: "Bahan baku tidak ditemukan" });
        }

        await ref.delete();
        res.json({ success: true, message: "Bahan baku dihapus" });

    } catch (error) {
        console.log("Delete ingredient error:", error);
        res.status(500).json({ success: false, message: "Gagal menghapus bahan baku" });
    }
};

// Restock bahan baku (tambah stok)
const restockIngredient = async (req, res) => {
    try {
        const { id, addStock } = req.body;

        if (!id || addStock === undefined) {
            return res.status(400).json({ success: false, message: "ID dan jumlah stok wajib diisi" });
        }

        const ref = getIngredientCollection().doc(id);
        const doc = await ref.get();

        if (!doc.exists) {
            return res.status(404).json({ success: false, message: "Bahan baku tidak ditemukan" });
        }

        const currentStock = doc.data().stock || 0;
        const newStock = currentStock + Number(addStock);

        await ref.update({ stock: newStock, updatedAt: Date.now() });
        res.json({ success: true, message: `Stok diperbarui: ${currentStock} → ${newStock}`, newStock });

    } catch (error) {
        console.log("Restock error:", error);
        res.status(500).json({ success: false, message: "Gagal restock bahan" });
    }
};

// Daftar bahan baku dengan stok rendah
const lowStockIngredients = async (req, res) => {
    try {
        const snapshot = await getIngredientCollection().get();
        const lowStock = snapshot.docs
            .map(doc => ({ _id: doc.id, ...doc.data() }))
            .filter(item => item.stock <= item.minStock);

        res.json({ success: true, data: lowStock });
    } catch (error) {
        console.log("Low stock error:", error);
        res.status(500).json({ success: false, message: "Gagal memuat data stok rendah" });
    }
};

export { addIngredient, listIngredients, updateIngredient, deleteIngredient, restockIngredient, lowStockIngredients };
