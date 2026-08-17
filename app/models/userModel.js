
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        phone: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        address: {
            street: {
                type: String,
                trim: true
            },

            city: {
                type: String,
                trim: true
            },

            state: {
                type: String,
                trim: true
            },

            pincode: {
                type: String,
                trim: true
            },

            country: {
                type: String,
                default: "India",
                trim: true
            }
        },

        profileImage: {
            type: String,
            default: null
        },

       
        passwordResetToken: {
           type: String,
          default: null
       },


       
passwordResetOTPExpires: {
    type: Date,
    default: null
},
 fcmToken: {
        type: String,
        default: null,
    },

    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);

export default User;
