import Subscription from "../models/subscriptionModel.js";
import Car from "../models/carModel.js";



export const updateExpiredSubscriptions = async () => {
    const now = new Date();

    const expiredSubscriptions = await Subscription.find({
        status: "active",
        endDate: { $lte: now }
    });

    for (const subscription of expiredSubscriptions) {
        subscription.status = "expired";

        await subscription.save();

        await Car.findByIdAndUpdate(
            subscription.car,
            {
                availabilityStatus: "available"
            }
        );
    }

    console.log(`${expiredSubscriptions.length} subscriptions expired.`);
};





// export const updateExpiredSubscriptions = async () => {
    
//     try {
//         const now = new Date();

//         const expiredSubscriptions = await Subscription.find({
//             status: "active",
//             endDate: { $lte: now }
//         });

//         for (const subscription of expiredSubscriptions) {
//             subscription.status = "expired";

//             await subscription.save();

//             await Car.findByIdAndUpdate(
//                 subscription.car,
//                 {
//                     availabilityStatus: "available"
//                 }
//             );
//         }

    
//     } catch (error) {
        
        
//     }
// };