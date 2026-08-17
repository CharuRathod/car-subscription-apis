import express from "express";
import userMiddleware from "../middleware/userMiddleware.js";

import {
    createSubscription,
    getAllSubscriptions,
    getMySubscriptions,
    getSubscriptionById,
   updateSubscription,
    verifyPayment
   
    
} from "../controllers/subscriptionController.js";


const router = express.Router();



router.post( "/", userMiddleware,createSubscription);
router.post( "/verify-payment", userMiddleware,verifyPayment);
router.get("/admin/all", userMiddleware,getAllSubscriptions);
router.get("/my-subscriptions",userMiddleware,getMySubscriptions);
router.get( "/:id", userMiddleware,getSubscriptionById);
router.put("/:id", userMiddleware, updateSubscription);



export default router;