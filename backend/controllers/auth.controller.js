import { User } from "../models/users.model.js";
import jwt from "jsonwebtoken";
import { redis } from "../utils/redis.js";

const generateTokens = (userId) => {
    const accessToken = jwt.sign({userId}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m"
    });
    const refreshToken = jwt.sign({userId}, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d"
    });
    return {accessToken, refreshToken};
}

const storeRefreshToken = async(userId, refreshToken) => {
    await redis.set(`refresh_token: ${userId}`, refreshToken, "EX", 7*24*60*60);
}
const setCookies = (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken,{ //(key, value, options)
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000
    });
    res.cookie("refreshToken", refreshToken,{
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
}

export const signup = async(req, res) => {
    try {
        const {email, password, name} = req.body;
        const emailExists = await User.findOne({email});
        if(emailExists){
            return res.status(400).json({message: "Email already exists"});
        }
        const user = await User.create({email, password, name});

        //authenticate
        const {accessToken, refreshToken} = generateTokens(user._id);
        await storeRefreshToken(user._id, refreshToken);
        setCookies(res, accessToken, refreshToken);
        res.status(201).json({user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }, message: "User created succssfully!!"});

    } catch (error) {
        console.log("Error in signup controller: ", error.message);
        res.status(500).json({message: error.message});
    }
}

export const login = async(req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(user){
            const isValidPassword = await user.comparePassword(password);
            if(isValidPassword){
                const {accessToken, refreshToken} = generateTokens(user._id);
                await storeRefreshToken(user._id, refreshToken);
                setCookies(res, accessToken, refreshToken);
            }
            else{
                res.status(400).json({
                    message: "Invalid Password!!"
                });
            }
        }
        else{
            res.status(404).json({
                message: "Invalid credentials!!"
            });
        }
        res.status(200).json({
            _id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
            message: "Loggedin successfully!!"
        });
    } catch (error) {
        console.log("Error in login controller: ", error.message);
        res.status(500).json({
            message: "Login Failed!!"
        });
    }
}

export const logout = async(req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if(refreshToken){
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET); //used to verify the refreshToken using the secret key stored in process.env.REFRESH_TOKEN_SECRET. If the token is valid, it returns a decoded payload containing the user's data (e.g., userId).
            await redis.del(`refresh_token: ${decoded.userId}`);
        }
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.status(200).json({message: "Logged out successfully!!"});
    } catch (error) {
        console.log("Error in logout controller: ", error.message);
        res.status(500).json({message: "Logout failed!!"});
    }
}

export const refreshAccessToken = async(req, res) => { //this will refresh the access token after it has been expired
    try {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken){
            return res.status(401).json({
                message: "No refresh token provided"
            })
        }
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const storedToken = await redis.get(`refresh_token: ${decoded.userId}`);
        if(storedToken !== refreshToken){
            return res.status(401).json({
                message: "Invalid refesh token"
            });
        }
        const accessToken = jwt.sign({userId: decoded.userId}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m"});
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000
        });
        res.json({
            message: "Token refreshed successfully!!"
        });
    } catch (error) {
        console.log("Error in refreshAccessToken controller: ", error.message);
        res.status(500).json({
            message: "Refreshing access token failed!!"
        });
    }
}