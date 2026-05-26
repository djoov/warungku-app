import { getFoodCollection } from '../models/foodModel.js';
import { connectDB } from '../config/db.js';
import 'dotenv/config.js';

// Connect to Firebase
connectDB();

const sampleFoods = [
    {
        name: "Nasi Goreng Spesial",
        description: "Nasi goreng dengan telur, ayam suwir, dan sayuran segar. Disajikan dengan kerupuk dan acar.",
        price: 18000,
        category: "Nasi",
        image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400"
    },
    {
        name: "Mie Ayam Bakso",
        description: "Mie ayam dengan bakso sapi kenyal, topping ayam cincang dan sayuran hijau segar.",
        price: 15000,
        category: "Mie",
        image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400"
    },
    {
        name: "Ayam Geprek Sambal",
        description: "Ayam goreng krispi digeprek dengan sambal bawang pedas. Disajikan dengan nasi dan lalapan.",
        price: 20000,
        category: "Ayam",
        image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400"
    },
    {
        name: "Soto Ayam",
        description: "Soto ayam kuah kuning khas Jawa dengan soun, telur, dan taburan bawang goreng.",
        price: 16000,
        category: "Soto",
        image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400"
    },
    {
        name: "Bakso Urat",
        description: "Bakso urat sapi jumbo dengan kuah kaldu gurih, mie kuning, dan tahu goreng.",
        price: 17000,
        category: "Bakso",
        image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400"
    },
    {
        name: "Nasi Padang Rendang",
        description: "Nasi putih dengan rendang sapi empuk dan bumbu rempah khas Minang yang kaya rasa.",
        price: 25000,
        category: "Nasi",
        image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400"
    },
    {
        name: "Es Teh Manis",
        description: "Teh manis dingin menyegarkan, cocok untuk menemani makan siang Anda.",
        price: 5000,
        category: "Minuman",
        image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400"
    },
    {
        name: "Gado-Gado",
        description: "Salad sayuran Indonesia dengan bumbu kacang, tahu, tempe, dan lontong.",
        price: 14000,
        category: "Sayur",
        image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400"
    },
    {
        name: "Pecel Lele",
        description: "Lele goreng krispi dengan sambal terasi dan lalapan segar. Disajikan dengan nasi.",
        price: 16000,
        category: "Ayam",
        image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400"
    },
    {
        name: "Es Jeruk Segar",
        description: "Jus jeruk segar dingin dengan rasa manis alami, sangat menyegarkan.",
        price: 7000,
        category: "Minuman",
        image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400"
    },
    {
        name: "Nasi Kuning Komplit",
        description: "Nasi kuning gurih dengan lauk ayam goreng, telur, sambal, dan lalapan.",
        price: 22000,
        category: "Nasi",
        image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400"
    },
    {
        name: "Mie Goreng Seafood",
        description: "Mie goreng dengan udang, cumi, dan sayuran segar. Disajikan dengan bumbu spesial.",
        price: 19000,
        category: "Mie",
        image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400"
    }
];

const seedDatabase = async () => {
    try {
        // Check if collection already has data
        const existing = await getFoodCollection().get();
        if (!existing.empty) {
            console.log(`Database already has ${existing.size} food items. Skipping seed.`);
            process.exit(0);
        }

        console.log("Seeding database with sample menu...");
        
        for (const food of sampleFoods) {
            await getFoodCollection().add(food);
            console.log(`  ✅ Added: ${food.name}`);
        }

        console.log(`\n🎉 Successfully seeded ${sampleFoods.length} food items!`);
        process.exit(0);
    } catch (error) {
        console.error("❌ Seed error:", error);
        process.exit(1);
    }
};

// Wait a bit for Firebase to initialize, then seed
setTimeout(seedDatabase, 2000);
