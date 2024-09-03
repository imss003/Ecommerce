import { User } from "../models/users.model.js";

export const protectRoute = async(req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;
        console.log("Access token is: ", accessToken);
        if (!accessToken) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        try {
            const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
            const user = await User.findById(decoded.userId).select("-password");
            if (!user) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            req.user = user; //we put the user in the req object so that if we want to access the user, we can access it. but remember we can only access the user if the route is protected i.e. user has logged in
            next();
        } catch (error) {
            if(error.name === "TokenExpiredError"){
                return res.status(401).json({ message: "Token has expired" });
            }
            throw error;
        }
    } catch (error) {
        console.log("Error in protectRoute middleware: ", error.message);
        return res.status(500).json({ message: "Route not protected!!" });
    }
}

export const adminRoute = async(req, res) => {
    try {
        if(req.user && req.user.role === "admin"){
            next();
        }
        else{
            return res.status(403).json({ message: "Access denied - Admin only!!" });
        }
    } catch (error) {
        console.log("Error in adminRoute middleware: ", error.message);
        return res.status(500).json({ message: "Route not protected!!" });
    }
}