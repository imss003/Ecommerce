import { Router } from "express";
import { createProduct, deleteProduct, getAllProducts, getFeaturedProducts, getProductByCategory, getRecommendedProducts, toggleFeaturedProducts } from "../controllers/product.controller.js";
import { adminRoute, protectRoute } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", protectRoute, adminRoute, getAllProducts); //here protectRoute and adminRoute are middleware checks because only admin can see all the products. so to ensure that the user is admin we do this.

router.get("/featured", getFeaturedProducts);

router.get("/recommendations", getRecommendedProducts);

router.get("/category/:category", getProductByCategory);

router.post("/", protectRoute, adminRoute, createProduct);

router.patch("/:id", protectRoute, adminRoute, toggleFeaturedProducts);

router.post("/:id", protectRoute, adminRoute, deleteProduct);

export default router;