const { parseInt, reduceRight } = require("lodash");
const express = require("express"); // Import express
const mongoose = require("mongoose"); // Import mongoose
const users = require("../models/userModel"); // Import the user model
const db = require("../config/db"); // Import the database connection
const bcrypt = require("bcrypt"); // Import bcrypt for password hashing
const jwt = require("jsonwebtoken"); // Import jsonwebtoken for token generation
const dotenv = require("dotenv"); // Import dotenv for environment variables
dotenv.config(); // Load environment variables from .env file
const Secret_Key = process.env.SECRET_KEY; // Define a secret key for JWT
const path = require("path"); // Import path for file handling
exports.getUser = async (req, res) => {
    try {
         const id = req.params.id;
         const user = await users.find({ id });
         return res.status(200).json({ message: "User fetched Successfully", user });
    }
    catch (error) { 
        console.error("Error fetching users:", error);
        return res.status(500).json({ message: "Internal server error" });
    };
};

exports.getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await users.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "User fetched Successfully", user });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "failed to fetch user" });
    }
}
   
exports.signupUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // Check if email, username, or password is missing
        if (!email || !username || !password) {
            return res.status(400).json({ message: "Please enter all required fields: username, email, and password." });
        }
        // Check if user already exists
        const user = await users.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new users({ username, email, password: hashedPassword });
        await newUser.save();
        console.log("User created successfully:", newUser);
        return res.redirect('/login')
        
    }
    catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    // Check if email or password is missing
    if (!email || !password) {
        return res.status(400).json({ message: "Please enter all required fields: email and password." });
    }
    try {
        // Find user by email
        const user = await users.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if password is correct
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ message: "Incorrect Password" });
        }

        // Store session (optional)
        req.session.user = {
            id: user._id,
            email: user.email
        };

        console.log("Login verified successfully");
        // Generate JWT token
        const token = jwt.sign({ id: users._id }, Secret_Key, { expiresIn: "1h" })
        console.log("Token generated:", token);
        // Send the token in the response
        res.cookie("token", token, { httpOnly: true, secure: false });
        return res.redirect('/dashboard'); 

    } catch (err) {
        console.error("Error logging in user:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};



exports.dashboard = async (req, res) => {
    try {
        const user = req.session.user;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        return res.status(200).json({ message: "User logged in successfully", user });
    }
    catch (error) {
        console.error("Error logging in user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.logoutUser =  (req, res) => {
    req.session.destroy( (err) => {
        if (err) {
          console.error("Session destroy error:", err);
          return res.status(500).json({ message: "Logout failed" });
        }
        res.clearCookie("token");
        res.clearCookie('connect.sid')
        console.log("User logged out successfully");
        return res.status(200).json({ message: "User logged out successfully" });
    })
}


exports.updateUser = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const user = await users.findByIdAndUpdate(id, data, { new: true });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "User updated Successfully", user });
    }
    catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({ message: "failed to update user" });
    }
}

exports.deleteUser = async (req, res) => { 
    try {
    const id = req.params.id;
    const user = await users.findByIdAndDelete(id);
    if (!user) {
        return res.status(404).json({ message: "User not found"})
    }
    return res.status(200).json({ message: "User deleted Successfully"})
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to delete user"})
    }
}


