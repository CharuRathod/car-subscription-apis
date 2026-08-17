import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendMail from "../utils/sendMail.js";
import User from "../models/userModel.js";
import { responseHandler } from "../utils/responseHandler.js";



export const registerUser = async (req, res) => {

    try {

        const {
            name,
            email,
            password,
            phone,
            address
            
        } = req.body;
        
        if (!name || !email || !password) {

            return responseHandler(res,400,"Name, email and password are required");
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {

            return responseHandler(res,400,"Email already registered");
        }
         const existingPhone = await User.findOne({ phone });

        if (existingPhone) {

            return responseHandler(res,400,"Phone number already registered");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            address

        });


         return responseHandler(res,201,"User registered successfully",
            {
                 id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                
                profileImage: user.profileImage,
                
            }
        );

    }      catch (error) {

              return responseHandler(res,500,"Server error");
    }
};



export const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {

            return responseHandler(res,400,"Email and password are required");
        }

        const user = await User.findOne({ email });

        if (!user) {

            return responseHandler(res,404,"User not found");
        }


        const isPasswordMatch = await bcrypt.compare(password,user.password);


        if (!isPasswordMatch) {

            return responseHandler(res,401,"Invalid email or password");
        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        
        return responseHandler(res,200,"Login successful",
            {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    
                }
            }
        );

    } catch (error) {

       return responseHandler(res, 500, "Server error");
    }
};



export const getProfile = async (req, res) => {

    try {

        const user = await User.findById(req.user.id)
            .select("-password");


        if (!user) {

            return responseHandler(res,404,"User not found");
        }


        return responseHandler(res,200,"Profile fetched successfully",user);

    } catch (error) {
     
        return responseHandler( res, 500,"Server error");
    }
};



 export const adminTest = async (req, res) => {

         return responseHandler(res,200,"Admin access successful",req.user);
};


export const updateProfile = async (req, res) => {
    try {

        const {
            name,
            email,
            phone,
            address,
            dateOfBirth,
            gender,
            profileImage
        } = req.body;


        const user = await User.findById(req.user.id);


        if (!user) {

            return responseHandler(
                res,
                404,
                "User not found"
            );
        }


        if (name) {
            user.name = name;
        }


        
        if (email && email !== user.email) {

            const existingEmail = await User.findOne({
                email,
                _id: { $ne: req.user.id }
            });

            if (existingEmail) {

                return responseHandler(
                    res,
                    400,
                    "Email already in use"
                );
            }

            user.email = email;
        }


        if (phone && phone !== user.phone) {

            const existingPhone = await User.findOne({
                phone,
                _id: { $ne: req.user.id }
            });

            if (existingPhone) {

                return responseHandler(
                    res,
                    400,
                    "Phone number already in use"
                );
            }

            user.phone = phone;
        }


        
        if (address) {
            user.address = {
                ...user.address,
                ...address
            };
        }


        
        if (dateOfBirth) {
            user.dateOfBirth = dateOfBirth;
        }


        
        if (gender) {
            user.gender = gender;
        }


       
        if (profileImage) {
            user.profileImage = profileImage;
        }


        await user.save();


        return responseHandler(
            res,
            200,
            "Profile updated successfully",
            {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                dateOfBirth: user.dateOfBirth,
                gender: user.gender,
                profileImage: user.profileImage,
                role: user.role
            }
        );

    } catch (error) {

        console.log(error);

        return responseHandler(
            res,
            500,
            "Server error"
        );
    }
};

export const deleteProfile = async (req, res) => {
    try {

        const user = await User.findById(req.user.id);

        if (!user) {
            return responseHandler(
                res,
                404,
                "User not found"
            );
        }

        await User.findByIdAndDelete(req.user.id);

        return responseHandler(
            res,
            200,
            "Profile deleted successfully"
        );

    } catch (error) {

        console.log(error);

        return responseHandler(
            res,
            500,
            "Server error"
        );
    }
};

// export const forgotPassword = async (req, res) => {

//     try {

//         const { email } = req.body;

//         if (!email) {

//             return responseHandler(res,400,"Email is required");

//         }
//         const user = await User.findOne({ email });


//         if (!user) {

//             return responseHandler(res,404,"User not found");

//         }

//         const resetToken = crypto
//             .randomBytes(32)
//             .toString("hex");

//         user.passwordResetToken = resetToken;

//         await user.save();

//         const resetUrl =`http://localhost:5173/reset-password/${resetToken}`;

//         await sendMail({

//             email: user.email,

//             subject: "Password Reset Request",

//             html: `
//                 <h2>Password Reset Request</h2>

//                 <p>Hello ${user.name},</p>

//                 <p>You requested to reset your password.</p>

//                 <p>Click the link below to reset your password:</p>

//                 <a href="${resetUrl}">Reset Password</a>
                
//                 <p>If you did not request this,please ignore this email.</p>
//             `

//         });


//         return responseHandler(res,200,"Password reset link sent successfully to your email");


//     } catch (error) {

//          console.log("FORGOT PASSWORD ERROR:", error);
//  console.log(error);
//     return responseHandler(res,500,"Server error");

//     }

// };



export const forgotPassword = async (req, res) => {

    try {

        const { email, phone } = req.body;


        if (!email && !phone) {

            return responseHandler(res,400,"Email or phone number is required");

        }


        if (email) {

            const user = await User.findOne({ email });


            if (!user) {

                return responseHandler(res,404,"User not found");

            }


            const resetToken = crypto
                .randomBytes(32)
                .toString("hex");


            user.passwordResetToken = resetToken;

            await user.save();


            const resetUrl =
                `http://localhost:5173/reset-password/${resetToken}`;


            await sendMail({

                email: user.email,

                subject: "Password Reset Request",

                html: `
                    <h2>Password Reset Request</h2>

                    <p>Hello ${user.name},</p>

                    <p>You requested to reset your password.</p>

                    <p>Click the link below to reset your password:</p>

                    <a href="${resetUrl}">
                        Reset Password
                    </a>

                    <p>
                        If you did not request this,
                        please ignore this email.
                    </p>
                `

            });


            return responseHandler(res,200,"Password reset link sent successfully to your email");
        }


        if (phone) {

            const user = await User.findOne({ phone });


            if (!user) {

                return responseHandler(res,404,"User not found");

            }


            const otp = Math.floor(
                100000 + Math.random() * 900000
            ).toString();


            user.passwordResetOTP = otp;

            user.passwordResetOTPExpires =
                new Date(Date.now() + 5 * 60 * 1000);


            await user.save();





            return responseHandler(
                res,
                200,
                "OTP generated successfully",
                {
                    phone: user.phone
                }
            );
        }


    } catch (error) {

        

        return responseHandler(
            res,
            500,
            "Server error"
        );

    }

};



export const resetPassword = async (req, res) => {

    try {

        const { token } = req.query;

        const { newPassword, confirmPassword } = req.body;


        if (!newPassword || !confirmPassword) {

            return responseHandler(
                res,
                400,
                "New password and confirm password are required"
            );
        }


        if (newPassword !== confirmPassword) {

            return responseHandler(
                res,
                400,
                "Passwords do not match"
            );
        }


        const user = await User.findOne({
            passwordResetToken: token
        });


        if (!user) {

            return responseHandler(res,
                400,
                "Invalid reset token"
            );
        }

        const hashedPassword = await bcrypt.hash(
    newPassword,
    10
);

user.password = hashedPassword;

user.passwordResetToken = null;

await user.save();

        return responseHandler(
            res,
            200,
            "Password reset successfully"
        );

    } catch (error) {

      

        return responseHandler(
            res,
            500,
            "Server error"
        );
    }
};

export const changePassword = async (req, res) => {

    try {

        const {
            currentPassword,
            newPassword,
            confirmPassword
        } = req.body;


        if (
            !currentPassword ||
            !newPassword ||
            !confirmPassword
        ) {

            return responseHandler(
                res,
                400,
                "All password fields are required"
            );
        }


        if (newPassword !== confirmPassword) {

            return responseHandler(
                res,
                400,
                "New password and confirm password do not match"
            );
        }

        const user = await User.findById(req.user.id);


        if (!user) {

            return responseHandler(
                res,
                404,
                "User not found"
            );
        }


       
        const isPasswordMatch = await bcrypt.compare(
            currentPassword,
            user.password
        );


        if (!isPasswordMatch) {

            return responseHandler(
                res,
                400,
                "Current password is incorrect"
            );
        }

        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        );


        user.password = hashedPassword;

        await user.save();


        return responseHandler(res,200,"Password changed successfully");

    } catch (error) {


        return responseHandler(res,500,"Server error");
    }
};


export const updateDeviceToken = async (req, res) => {
    try {
        const { fcmToken } = req.body;

        if (!fcmToken) {
            return responseHandler(
                res,
                400,
                "Device token is required"
            );
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            {
                fcmToken: fcmToken,
            },
            {
                new: true,
            }
        ).select("-password");

        if (!user) {
            return responseHandler(
                res,
                404,
                "User not found"
            );
        }

        return responseHandler(
            res,
            200,
            "Device token saved successfully",
            {
                fcmToken: user.fcmToken,
            }
        );

    } catch (error) {
        console.error(
            "Update device token error:",
            error
        );

        return responseHandler(
            res,
            500,
            error.message
        );
    }
};

