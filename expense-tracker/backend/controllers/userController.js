import User from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return secret;
};

const TOKEN_EXPIRY = process.env.TOKEN_EXPIRY || "24h";

const createToken = (userId) => 
    jwt.sign({ id: userId }, getJwtSecret(), { expiresIn: TOKEN_EXPIRY });

// Register a new user

export async function registerUser(req, res) {
  const { name, email, password } = req.body;
  if(!name || !email || !password) {
    return res.status(400).json({ 
        success: false,
        message: "Please fill all the fields" });
  }
  if(!validator.isEmail(email)) {
    return res.status(400).json({ 
        success: false,
        message: "Please enter a valid email" });
  }
  if(password.length < 8) {
    return res.status(400).json({ 
        success: false,
        message: "Password must be at least 8 characters long" });
  }
  try{
    if(await User.findOne({ email })) {
        return res.status(400).json({ 
            success: false,
            message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({name, email, password: hashed});
    const token = createToken(user._id);
    res.status(201).json({
        success: true,
        message: "User registered successfully",
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ 
        success: false,
        message: "Internal server error" });
  }
}

//to login a user
export async function loginUser(req, res) {
    const { email, password } = req.body;
    if(!email || !password) {
        return res.status(400).json({ 
            success: false,
            message: "Please fill all the fields" });
    }
    try {
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({ 
                success: false,
                message: "Invalid credentials" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({ 
                success: false,
                message: "Invalid credentials" });
        }
        const token = createToken(user._id);
        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ 
            success: false,
            message: "Internal server error" });
    }
}

//to get user details

export async function getUserDetails(req, res) {
    const userId = req.user.id || req.user._id;
    try {
        const user = await User.findById(userId).select("name email");
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: "User not found" });
        }
        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ 
            success: false,
            message: "Internal server error" });
    }
}

// to update user details
export async function updateUserDetails(req, res) {
    const userId = req.user.id || req.user._id;
    const { name, email } = req.body;

    if(!name || !email || !validator.isEmail(email)) {
        return res.status(400).json({ 
            success: false,
            message: "Please fill all the valid email and name fields" });
    }

    try {
        const existingEmail = await User.findOne({ email, _id: { $ne: userId } });
        if (existingEmail) {
            return res.status(400).json({
                success: false,
                message: "Email already in use"
            });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { name, email },
            { returnDocument: 'after', runValidators: true, select: "name email" }
        );
        if(!user) {
            return res.status(404).json({ 
                success: false,
                message: "User not found" });
        }
        res.status(200).json({
            success: true,
            message: "User details updated successfully",
            user
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Email already in use"
            });
        }
        console.error(err);
        res.status(500).json({ 
            success: false,
            message: "Internal server error" });
    }
}

// to change user password
export async function changeUserPassword(req, res) {
    const userId = req.user.id || req.user._id;
    const { currentPassword, newPassword } = req.body;
    if(!currentPassword || !newPassword || newPassword.length < 8) {
        return res.status(400).json({ 
            success: false,
            message: "Please fill all the fields and new password must be at least 8 characters long" });
    }
    try {
        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({ 
                success: false,
                message: "User not found" });
        }
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if(!isMatch) {
            return res.status(400).json({ 
                success: false,
                message: "Current password is incorrect" });
        }
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });
    }

    catch (err) {
        console.error('Error changing password:', err);
        res.status(500).json({ 
            success: false,
            message: "Internal server error" });
    }
}    