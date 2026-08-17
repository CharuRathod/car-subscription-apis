import express from "express";
import userMiddleware from "../middleware/userMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import carUpload from "../middleware/carUploadMiddleware.js";
import sharpMiddleware from "../middleware/sharpMiddleware.js";

import {
    addCar,
    getAllCars,
    getCarById,
    updateCar,
    deleteCar,
    getAvailableCars
    
    
} from "../controllers/carController.js";



const router = express.Router();

router.post("/",userMiddleware,adminMiddleware,carUpload.array("image", 5),addCar);
router.get("/", getAllCars);
router.get("/available", getAvailableCars);
router.get("/:id", getCarById);
router.put( "/:id", userMiddleware, adminMiddleware, carUpload.array("image", 5), updateCar);
router.delete( "/:id",userMiddleware,adminMiddleware, deleteCar);


export default router;