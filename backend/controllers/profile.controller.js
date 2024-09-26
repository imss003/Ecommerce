import { User } from "../models/users.model.js";
import bcrypt from "bcrypt";

export const getUserProfile = async(req, res) => {
    try {
        const user = req.user;
        console.log("user in getProfile is: ", user);
        res.status(200).json(user);
    } catch (error) {
        console.log("Error in getProfile controller: ", error);
        res.status(500).json({
            message: "Internal Server Error!"
        });
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log(typeof password);
        const userId = req.user._id; // req.user is set by authentication middleware
        console.log("USer id is: ", userId);
        // Find user in the database first
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found in update profile!!"
            });
        }

        // Update fields if they are provided
        if (name) user.name = name;
        if (email) user.email = email;
        if (password) {
            user.password = password;
        }

        // Save the updated user back to the database
        const updatedUser = await user.save();

        res.status(200).json(updatedUser);
    } catch (error) {
        console.log("Error in update profile controller: ", error);
        res.status(500).json({
            message: "Internal server error!!"
        });
    }
};
