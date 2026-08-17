import Subscription from "../models/subscriptionModel.js";
import Car from "../models/carModel.js";
import { responseHandler } from "../utils/responseHandler.js";
import razorpay from "../config/razorpay.js";
import User from "../models/userModel.js";
import { sendPushNotification } from "../utils/sendPushNotification.js";


export const createSubscription = async (req, res) => {
    try {

        const { carId, duration } = req.body;

        if (!carId) {
            return responseHandler(
                res,
                400,
                "Car ID is required"
            );
        }

        if (!duration || Number(duration) < 1) {
            return responseHandler(
                res,
                400,
                "Valid duration is required"
            );
        }

        const car = await Car.findById(carId);

        if (!car) {
            return responseHandler(
                res,
                404,
                "Car not found"
            );
        }

        if (car.availabilityStatus !== "available") {
            return responseHandler(
                res,
                400,
                "Car is not available"
            );
        }

        const startDate = new Date();

        const endDate = new Date(startDate);

        endDate.setMonth(
            endDate.getMonth() + Number(duration)
        );

        const totalPrice =
            car.monthlySubscriptionPrice * Number(duration);

        const options = {
            amount: totalPrice * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);
const user  =await User.findById({_id:req.user.id})
console.log("user===========",user);

        const subscription = await Subscription.create({

            user: req.user.id,
            customerName:user.name,
            phone:user.phone,


            car: carId,

            monthlyPrice: car.monthlySubscriptionPrice,

            duration: Number(duration),

            totalPrice,

            startDate,

            endDate,

            razorpayOrderId: order.id,

            razorpayPaymentId: null,

            paymentStatus: "pending",

            status: "pending"
        });

        if (user.fcmToken) {
  await sendPushNotification(
    user.fcmToken,
    "Subscription Created",
    "Your subscription has been created successfully.",
    {
        type: "subscription_created",
        subscriptionId: subscription._id.toString(),
    }
);
}



        // await subscription.populate([
        //     {
        //         path: "user",
        //         select: "name email phone address profileImage dateOfBirth gender role"
        //     },
        //     {
        //         path: "car"
        //     }
        // ]);

        return responseHandler(
            res,
            201,
            "Subscription created successfully",
            {
                subscription,
                order
            }
        );

    } catch (error) {

        return responseHandler(
            res,
            500,
            error.message
        );
    }
};

// export const verifyPayment = async (req, res) => {

//     try {

//         const {
//             razorpay_payment_id,
//             razorpay_order_id,
//             razorpay_signature,
//             carId,
//             duration
//         } = req.body;


//         if (
//             !razorpay_payment_id ||
//             !razorpay_order_id ||
//             !razorpay_signature ||
//             !carId ||
//             !duration
//         ) {
//             return responseHandler(res,400,"Payment details are required");
//         }

//         const body =razorpay_order_id +"|" +razorpay_payment_id;


//         const expectedSignature =crypto.createHmac
//                   (
//                     "sha256",
//                     process.env.RAZORPAY_KEY_SECRET
//                 )
//                 .update(body.toString())
//                 .digest("hex");


       
//         if (expectedSignature !== razorpay_signature) {

//             return responseHandler(res,400,"Invalid payment signature");

//         }

//         const car = await Car.findById(carId);


//         if (!car) {
//             return responseHandler(res,404,"Car not found");
//         }

//         const startDate = new Date();

//         const endDate = new Date(startDate);

//         endDate.setMonth(
//             endDate.getMonth() + Number(duration)
//         );


//         const subscription =
//             await Subscription.create({

//                 user: req.user.id,

//                 car: carId,

//                 monthlyPrice:
//                     car.monthlySubscriptionPrice,

//                 startDate,

//                 endDate,

//                 status: "active"

//             });


//         car.availabilityStatus = "unavailable";

//         await car.save();
      
//         return responseHandler(res,200,"Payment verified and subscription created successfully",
//             {
//                 subscription,
//                 razorpay_payment_id,
//                 razorpay_order_id
//             }
//         );


//     } catch (error) {

//         return responseHandler(res,500,"Server error");

//     }

// };


// export const getMySubscriptions = async (req, res) => {

//     try {

//         const subscriptions = await Subscription.find({
//             user: req.user.id
//         })
//         .populate("car");

//         return responseHandler(res,200,"Subscriptions fetched successfully",subscriptions);

//     } catch (error) {

//          return responseHandler(res,500,"Server error");
//     }
// };


// export const getSubscriptionById = async (req, res) => {

//     try {

//         const { id } = req.params;

//         const subscription = await Subscription.findOne({
//             _id: id,
//             user: req.user.id
//         }).populate("car");

//         if (!subscription) {
//             return responseHandler(
//                 res,
//                 404,
//                 "Subscription not found"
//             );
//         }

//         return responseHandler(
//             res,
//             200,
//             "Subscription fetched successfully",
//             subscription
//         );

//     } catch (error) {

//         console.log(
//             "GET SUBSCRIPTION BY ID ERROR:",
//             error
//         );

//         return responseHandler(
//             res,
//             500,
//             "Server error"
//         );
//     }
// };
export const verifyPayment = async (req, res) => {

    try {

        const {
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature
        } = req.body;


        if (
            !razorpay_payment_id ||
            !razorpay_order_id ||
            !razorpay_signature
        ) {
            return responseHandler(
                res,
                400,
                "Payment details are required"
            );
        }


        const body =
            razorpay_order_id +
            "|" +
            razorpay_payment_id;


        const expectedSignature = crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_KEY_SECRET
            )
            .update(body)
            .digest("hex");


        if (expectedSignature !== razorpay_signature) {

            return responseHandler(
                res,
                400,
                "Invalid payment signature"
            );
        }


        const subscription =
            await Subscription.findOne({
                razorpayOrderId: razorpay_order_id,
                user: req.user.id
            });


        if (!subscription) {

            return responseHandler(
                res,
                404,
                "Subscription not found"
            );
        }


        subscription.razorpayPaymentId =
            razorpay_payment_id;

        subscription.paymentStatus = "paid";

        // Payment hone ke baad bhi admin approval ka wait
        subscription.status = "pending";


        await subscription.save();


        await subscription.populate([
            {
                path: "user",
                select: "name email phone address profileImage dateOfBirth gender role"
            },
            {
                path: "car"
            }
        ]);


        return responseHandler(
            res,
            200,
            "Payment verified successfully. Waiting for admin approval",
            subscription
        );

    } catch (error) {

        return responseHandler(
            res,
            500,
            error.message
        );
    }
};

export const getAllSubscriptions = async (req, res) => {

    try {

        const { status } = req.query;

        const filter = {};

        if (status) {
            filter.status = status;
        }


        const subscriptions =
            await Subscription.find(filter)
            .populate(
                "user",
                "name email phone address profileImage dateOfBirth gender role"
            )
            .populate("car");


        return responseHandler(
            res,
            200,
            "Subscriptions fetched successfully",
            subscriptions
        );

    } catch (error) {

        return responseHandler(
            res,
            500,
            error.message
        );
    }
};



export const getMySubscriptions = async (req, res) => {

    try {

        const subscriptions =
            await Subscription.find({
                user: req.user.id,
        
                
            })
             .select(
            "customerName phone car carName brand model carImage monthlyPrice duration totalPrice startDate endDate paymentStatus status address gender"
        );

        return responseHandler(
            res,
            200,
            "My subscriptions fetched successfully",
            subscriptions
        );

    } catch (error) {

        return responseHandler(
            res,
            500,
            error.message
        );
    }
};

export const getSubscriptionById = async (req, res) => {

    try {

        const { id } = req.params;

        const subscription = await Subscription.findOne({
    _id: id,
    user: req.user.id
})
.populate("car")
.populate(
    "user",
    "name email phone address profileImage dateOfBirth gender role"
);

        

        if (!subscription) {
            return responseHandler(res,404,"Subscription not found");
        }

        return responseHandler(res,200,"Subscription fetched successfully",subscription);

    } catch (error) {

       return responseHandler(res,500,"Server error");
    }
};


export const updateSubscription = async (req, res) => {

    try {

        const { id } = req.params;

        const { status } = req.body;


        if (
            !["active", "rejected"].includes(status)
        ) {
            return responseHandler(
                res,
                400,
                "Status must be active or rejected"
            );
        }


        const subscription =
            await Subscription.findById(id);


        if (!subscription) {

            return responseHandler(
                res,
                404,
                "Subscription not found"
            );
        }


        if (subscription.status !== "pending") {

            return responseHandler(
                res,
                400,
                "Only pending subscriptions can be approved or rejected"
            );
        }


    
        if (subscription.paymentStatus !== "paid") {

            return responseHandler(
                res,
                400,
                "Payment is not completed"
            );
        }


        subscription.status = status;

        await subscription.save();


        // APPROVE
        if (status === "active") {

            await Car.findByIdAndUpdate(
                subscription.car,
                {
                    availabilityStatus: "unavailable"
                }
            );
        }


        // REJECT
        if (status === "rejected") {

            await Car.findByIdAndUpdate(
                subscription.car,
                {
                    availabilityStatus: "available"
                }
            );
        }


        await subscription.populate([
            {
                path: "user",
                select: "name email phone address profileImage dateOfBirth gender role"
            },
            {
                path: "car"
            }
        ]);


        return responseHandler(
            res,
            200,
            `Subscription ${status} successfully`,
            subscription
        );

    } catch (error) {

        return responseHandler(
            res,
            500,
            error.message
        );
    }
};










