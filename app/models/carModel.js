import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
    {
        carName: {
            type: String,
            required: true,
            trim: true
        },

        brand: {
            type: String,
            required: true,
            trim: true
        },

        model: {
            type: String,
            required: true,
            trim: true
        },

        monthlySubscriptionPrice: {
            type: Number,
            required: true
        },

        image: {
            type:  [String],
            default: ""
        },

        registrationNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        availabilityStatus: {
            type: String,
            enum: ["available", "unavailable"],
            default: "available"
        }
    },
    {
        timestamps: true
    }
);

const Car = mongoose.model("Car", carSchema);

export default Car;