// import mongoose from "mongoose";

// const paymentSchema = new mongoose.Schema(
//     {
//         user: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "User",
//             required: true
//         },

//         subscription: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "Subscription",
//             required: false
//         },

//         orderId: {
//             type: String,
//             required: true
//         },

//         paymentId: {
//             type: String,
//             required: false
//         },

//         amount: {
//             type: Number,
//             required: true
//         },

//         paymentStatus: {
//             type: String,
//             enum: ["created", "paid", "failed"],
//             default: "created"
//         },

//         transactionDate: {
//             type: Date
//         }
//     },
//     {
//         timestamps: true
//     }
// );

// const Payment = mongoose.model("Payment", paymentSchema);

// export default Payment;