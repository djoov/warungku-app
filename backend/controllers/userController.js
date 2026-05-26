import { getUserCollection } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check Admin credentials first
        const adminEmail = process.env.ADMIN_EMAIL || "admin@remesan.com";
        const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

        if (email === adminEmail && password === adminPassword) {
            const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET || "random_secret", { expiresIn: '1d' });
            return res.json({ success: true, token, role: "admin" });
        }

        // Check Firebase users collection if not admin
        const snapshot = await getUserCollection().where("email", "==", email).get();

        if (snapshot.empty) {
            return res.status(404).json({ success: false, message: "User doesn't exist" });
        }

        const userDoc = snapshot.docs[0];
        const user = userDoc.data();

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = createToken(userDoc.id);
        res.json({ success: true, token, role: "user" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error" });
    }
}

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || "random_secret", { expiresIn: '7d' });
}

// register user
const registerUser = async (req, res) => {
    const { name, password, email } = req.body;
    try {
        // checking if user already exists
        const snapshot = await getUserCollection().where("email", "==", email).get();
        if (!snapshot.empty) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // validating email format & strong password
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email" });
        }

        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Please enter a strong password" });
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = {
            name: name,
            email: email,
            password: hashedPassword,
            cartData: {}
        };

        const docRef = await getUserCollection().add(newUser);
        const token = createToken(docRef.id);
        
        res.json({ success: true, token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error" });
    }
}

import admin from "firebase-admin";

// SSO login (Google / Phone)
const ssoLogin = async (req, res) => {
    const { idToken, mode } = req.body; // mode: "login" or "register"
    try {
        // Verify Firebase ID Token
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const uid = decodedToken.uid;
        
        // Extract info from token
        const email = decodedToken.email || `${decodedToken.phone_number}@phone.user`;
        const name = decodedToken.name || decodedToken.phone_number || "User";

        // Check if user exists in our Firestore
        const snapshot = await getUserCollection().where("email", "==", email).get();

        if (mode === "login" || !mode) {
            // Login mode: user must already exist
            if (snapshot.empty) {
                return res.status(404).json({ 
                    success: false, 
                    message: "Akun belum terdaftar. Silakan daftar terlebih dahulu.",
                    email: email,
                    name: name
                });
            }
            const userId = snapshot.docs[0].id;
            const token = createToken(userId);
            return res.json({ success: true, token, role: "user" });
        }

        if (mode === "register") {
            // Register mode: create new user if not exists
            if (!snapshot.empty) {
                // User already exists, just log them in
                const userId = snapshot.docs[0].id;
                const token = createToken(userId);
                return res.json({ success: true, token, role: "user" });
            }
            const newUser = {
                name: name,
                email: email,
                password: "sso-no-password",
                cartData: {}
            };
            const docRef = await getUserCollection().add(newUser);
            const token = createToken(docRef.id);
            return res.json({ success: true, token, role: "user" });
        }

        res.status(400).json({ success: false, message: "Invalid mode" });

    } catch (error) {
        console.log("SSO Login Error:", error);
        res.status(401).json({ success: false, message: "Invalid SSO Token" });
    }
}

// list all users (admin only)
const listUsers = async (req, res) => {
    try {
        const snapshot = await getUserCollection().get();
        const users = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                _id: doc.id,
                name: data.name,
                email: data.email,
                isSSO: data.password === "sso-no-password",
                cartItemCount: data.cartData ? Object.keys(data.cartData).length : 0
            };
        });
        res.json({ success: true, data: users });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error fetching users" });
    }
}
// get user profile
const getProfile = async (req, res) => {
    try {
        const userId = req.body.userId;
        const userDoc = await getUserCollection().doc(userId).get();
        if (!userDoc.exists) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const userData = userDoc.data();
        res.json({
            success: true,
            data: {
                name: userData.name,
                email: userData.email,
                avatarUrl: userData.avatarUrl || ""
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error fetching profile" });
    }
}

import { bucket } from '../config/db.js';

// update user profile
const updateProfile = async (req, res) => {
    try {
        const userId = req.body.userId;
        const { name } = req.body;
        let updateData = {};

        if (name) updateData.name = name;

        // If there's an avatar file, upload to Firebase Storage
        if (req.file) {
            const fileName = `profile_${userId}_${Date.now()}`;
            const file = bucket.file(`profile_images/${fileName}`);
            
            await file.save(req.file.buffer, {
                metadata: { contentType: req.file.mimetype }
            });

            await file.makePublic();
            updateData.avatarUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
        }

        if (Object.keys(updateData).length > 0) {
            await getUserCollection().doc(userId).update(updateData);
        }

        res.json({ success: true, message: "Profile updated successfully", data: updateData });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error updating profile" });
    }
}

export { loginUser, registerUser, ssoLogin, listUsers, getProfile, updateProfile }