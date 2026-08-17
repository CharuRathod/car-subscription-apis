import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        car: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Car",
            required: true
        },
        brand: {
            type: String,
    
        },
        
        model: {
            type: String,
            required: true,
            trim: true
        },

        customerName:{
            type:String
        },
      phone:{
            type:String
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
        

        monthlyPrice: {
            type: Number,
            required: true
        },

        duration: {
            type: Number,
            required: true
        },

        totalPrice: {
            type: Number,
            required: true
        },

        startDate: {
            type: Date,
            required: true
        },

        endDate: {
            type: Date,
            required: true
        },

        status: {
            type: String,
            enum: [
                "pending",
                "active",
                "expired",
                "cancelled"
            ],
            default: "pending"
        },

        razorpayOrderId: {
            type: String,
            default: null
        },

        razorpayPaymentId: {
            type: String,
            default: null
        },

        paymentStatus: {
            type: String,
            enum: [
                "pending",
                "paid",
                "failed"
            ],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

const Subscription = mongoose.model(
    "Subscription",
    subscriptionSchema
);

export default Subscription;