import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
    const { token } = req.headers;
    
    if (!token) {
        return res.status(401).json({ success: false, message: "Not Authorized. Login as Admin." });
    }
    
    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET || "random_secret");
        
        // Ensure the token has the admin role
        if (token_decode.role !== "admin") {
            return res.status(403).json({ success: false, message: "Access Denied. Admins only." });
        }
        
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: "Invalid Token" });
    }
}

export default adminAuth;
