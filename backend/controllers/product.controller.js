import { Product } from "../models/product.model.js";
import cloudinary from "../utils/cloudinary.js";
import { redis } from "../utils/redis.js";

const updateFeaturedProductCache = async() => {
    try {
        const featuredProducts = await Product.find({isFeatured: true}).lean();
        await redis.set("featured_products", JSON.stringify(featuredProducts));
    } catch (error) {
        console.log("Error in updateFeaturedProductsCache: ", error.message);
    }
}

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({}); //empty object is used to ensure that we get all the products
        res.status(200).json({
            products
        });
    } catch (error) {
        console.log("Error in getAllProducts controller: ", error.message);
        res.status(500).json({
            message: "Internal server error!!"
        });
    }
};

export const getFeaturedProducts = async(req, res) => {//we will store it in redis too because redis is fast and hence we want it to be fast since it has to be accessed by different users.
    try {
        let featuredProducts = await redis.get("featured_products");
        if(featuredProducts){
            return res.json(JSON.parse(featuredProducts)); //we parse it because redis is gonna store it as a string
        }
        //if not in redis, then fetch from mongodb
        featuredProducts = await Product.find({isFeatured: true}).lean();
        //the .lean() function is used to return a plain JavaScript array of featured products, which can then be easily stored in Redis as a string using JSON.stringify(). Mongoose provides specific functionlaities like ._id, save(), remove() but in this case we dont want these extra functionalities hence we use lean().
        if(!featuredProducts){
            res.status(404).json({
                message: "No featured products found!!"
            });
        }

        //if featuredProducts is there, then we will store it in redis for quick access
        await redis.set("featured_products", JSON.stringify(featuredProducts));
        res.json(featuredProducts);
    } catch (error) {
        console.log("Error in featured products: ", error.message);
        res.status(500).json({
            message: "Internal server error!!"
        });
    }
}

export const createProduct = async(req, res) => {
    try {
        const {name, description, price, image, category} = req.body;
        let cloudinaryResponse = nul;
        if(image){
            cloudinaryResponse = await cloudinary.uploader.upload(image,{folder:"products"});
        }
        const product = await Product.create({
            name,
            description,
            price,
            image: cloudinaryResponse?.secure_url?cloudinaryResponse.secure_url : "",
            category
        });
        res.status(200).json({
            message: "Product created successfully!!",
            product
        });
    } catch (error) {
        console.log("Error in createProduct controller: ", error.message);
        res.status(500).json({
            message: "Internal server error!!"
        });
    }   
}

export const deleteProduct = async(req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if(!product){
            return res.status(404).json({
                message: "Product not found"
            });
        }
        if(product.image){
            const publicId = product.image.split("/").pop().split(".")[0];//used to get the public id from url
            try {
                await cloudinary.uploader.destroy(`products/${publicId}`);
                console.log("Deleted image from cloudinary!!");

            } catch (error) {
                console.log("Deleting image from cloudinary failed!!");

            }
        }
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({
            message: "Deleted the product successfully!!"
        });
    } catch (error) {
        console.log("Error in deleteProduct controller: ", error.message);
        res.status(500).json({
            message: "Internal Server Error!!"
        });
    }
}

export const getRecommendedProducts = async(req, res) => {
    try {
        const products = await Product.aggregate([{
                $sample: {size:3}
            },
            {
                $project:{
                    _id:1,
                    name:1,
                    description:1,
                    image:1,
                    price:1
                }
            }
        ]);
        res.status(200).json({
            message: "Successfully got recommendatons!!",
            products
        });
    } catch (error) {
        console.log("Error in getRecommendedProducts controller!!");
        res.status(500).json({
            message: "Internal Server Error!!"
        });
    }
}

export const getProductByCategory = async(req, res) => {
    try {
        const category = req.params.category;
        const products = await Product.find({
            message: "Successfully got products by category!!",
            products
        });
        res.status(200).json(products);
    } catch (error) {
        console.log("Error in getProductByCategory: ", error.message);
        res.status(500).json({
            message: "Internal Server Error!!"
        });
    }
}

export const toggleFeaturedProducts = async(req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if(product){
            product.isFeatured = !product.isFeatured;
            const updatedProduct = await product.save();
            await updateFeaturedProductCache();
            res.json(updatedProduct);
        }
        else{
            res.status(404).json({
                message: "Product not found!!"
            });
        }
    } catch (error) {
        console.log("Error in toggleFeaturedProduct controller: ", error.message);
        res.status(500).json({
            message: "Internal Server Error!!"
        });
    }
}