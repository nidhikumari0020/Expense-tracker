import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return secret;
};

export default async function auth(req, res, next) {

    //grab the tokaen
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ 
            success: false,
            message: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, getJwtSecret());
        req.user = await User.findById(decoded.id).select("-password");
       if(!req.user) {
        return res.status(401).json({ 
            success: false,
            message: "Unauthorized" });
       }
      
       next();
    } catch (err) {
        console.error('JWT verification error:', err);
        res.status(401).json({ 
            success: false,
            message: "Token is not valid" });
    }
}    