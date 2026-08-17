import express from "express";
import userMiddleware from "../middleware/userMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import { registerUser, 
    loginUser, 
     forgotPassword,
     resetPassword,
     changePassword,
      getProfile,
      updateProfile,
       deleteProfile,
       
    adminTest, 
    updateDeviceToken
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password",  resetPassword);
router.put("/change-password",userMiddleware,changePassword);
router.get("/profile", userMiddleware, getProfile);
router.put("/profile", userMiddleware, updateProfile);

router.patch(
    "/device-token",
    userMiddleware,
    updateDeviceToken
    
);


router.delete("/profile", userMiddleware, deleteProfile);

router.get("/admin-test",userMiddleware,adminMiddleware,adminTest);

export default router;
