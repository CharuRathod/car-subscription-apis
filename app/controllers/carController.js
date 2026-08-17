import Car from "../models/carModel.js";
import { responseHandler } from "../utils/responseHandler.js";
import APIFeatures from "../utils/apiFeatures.js";
// import cloudinary from "../config/cloudinary.js";
import { uploadToCloudinary,  deleteCloudinaryImage } from "../utils/cloudinaryUpload.js";


export const addCar = async (req, res) => {

    try {

        const {
            carName,
            brand,
            model,
            monthlySubscriptionPrice,
            registrationNumber
        } = req.body;

        // Check required fields
        if (
            !carName ||
            !brand ||
            !model ||
            !monthlySubscriptionPrice ||
            !registrationNumber
        ) {

            return responseHandler(
                res,
                400,
                "All required fields are required"
            );
        }


        // Check registration number already exists
        const existingCar = await Car.findOne({
            registrationNumber
        });

        if (existingCar) {

            return responseHandler(
                res,
                400,
                "Car with this registration number already exists"
            );
        }


        // Upload multiple images to Cloudinary
        const images = [];
        if (req.files && req.files.length > 0) {

            for (const file of req.files) {

                const result = await uploadToCloudinary(
                    file.buffer,
                    "car-subscription/cars"
                );

                images.push(result.secure_url);
            }
        }



        // Create car
        const car = await Car.create({

            carName,
            brand,
            model,
            monthlySubscriptionPrice,
            image: images,
            registrationNumber

        });


        return responseHandler(
            res,
            201,
            "Car added successfully",
            car
        );


    } catch (error) {

        

        return responseHandler(
            res,
            500,
            "Server error"
        );
    }
};


export const getAllCars = async (req, res) => {

    try {

        const {
            search,
            brand,
            minPrice,
            maxPrice
        } = req.query;


        // Base query
        // const query = {
        //     availabilityStatus: "available"
        // };
const query = {

        };

        // Search by car name, brand or model
        if (search) {

            query.$or = [
                { carName: { $regex: search, $options: "i" } },
                { brand: { $regex: search, $options: "i" } },
                { model: { $regex: search, $options: "i" } }
            ];
        }


        // Filter by brand
        if (brand) {
            query.brand = {
                $regex: brand,
                $options: "i"
            };
        }


        // Price filter
        if (minPrice || maxPrice) {

            query.monthlySubscriptionPrice = {};

            if (minPrice) {
                query.monthlySubscriptionPrice.$gte =
                    Number(minPrice);
            }

            if (maxPrice) {
                query.monthlySubscriptionPrice.$lte =
                    Number(maxPrice);
            }
        }


        const cars = await Car.find(query);


        return responseHandler(
            res,
            200,
            "Cars fetched successfully",
            {
                count: cars.length,
                cars
            }
        );

    } catch (error) {

        
        

        return responseHandler(
            res,
            500,
            "Server error"
        );
    }
};


// export const getAvailableCars = async (req, res) => {
//     try {
//         const {
//             search,
//             brand,
//             minPrice,
//             maxPrice,
//             page = 1,
//             limit = 10
//         } = req.query;


//         // Convert page and limit to numbers
//         const currentPage = Number(page);
//         const itemsPerPage = Number(limit);


//         // Calculate skip
//         const skip = (currentPage - 1) * itemsPerPage;


//         // Base query
//         const query = {
//             availabilityStatus: "available"
//         };


//         // Search by car name, brand or model
//         if (search) {
//             query.$or = [
//                 {
//                     carName: {
//                         $regex: search,
//                         $options: "i"
//                     }
//                 },
//                 {
//                     brand: {
//                         $regex: search,
//                         $options: "i"
//                     }
//                 },
//                 {
//                     model: {
//                         $regex: search,
//                         $options: "i"
//                     }
//                 }
//             ];
//         }


//         // Filter by brand
//         if (brand) {
//             query.brand = {
//                 $regex: brand,
//                 $options: "i"
//             };
//         }


//         // Price filter
//         if (minPrice || maxPrice) {

//             query.monthlySubscriptionPrice = {};

//             if (minPrice) {
//                 query.monthlySubscriptionPrice.$gte =
//                     Number(minPrice);
//             }

//             if (maxPrice) {
//                 query.monthlySubscriptionPrice.$lte =
//                     Number(maxPrice);
//             }
//         }


//         // Total matching cars
//         const total = await Car.countDocuments(query);


//         // Fetch cars with pagination
//         const cars = await Car.find(query)
//             .skip(skip)
//             .limit(itemsPerPage);


//         // Calculate total pages
//         const totalPages = Math.ceil(
//             total / itemsPerPage
//         );


//         return responseHandler(
//             res,
//             200,
//             "Cars fetched successfully",
//             {
//                 cars,

//                 pagination: {
//                     total: total,
//                     page: currentPage,
//                     limit: itemsPerPage,
//                     totalPages: totalPages
//                 }
//             }
//         );

//     } catch (error) {

//         console.log(error);

//         return responseHandler(
//             res,
//             500,
//             "Server error"
//         );
//     }
// };

export const getAvailableCars = async (req, res) => {
    try {

        const {
            search,
            brand,
            minPrice,
            maxPrice,
            page = 1,
            limit = 10
        } = req.query;

        const currentPage = Math.max(Number(page) || 1, 1);
        const itemsPerPage = Math.max(Number(limit) || 10, 1);
        const skip = (currentPage - 1) * itemsPerPage;


        const query = {
            availabilityStatus: "available"
        };


        // Search
        if (search) {

            query.$or = ["carName", "brand", "model"].map(field => ({
                [field]: {
                    $regex: search,
                    $options: "i"
                }
            }));
        }


        // Brand filter
        if (brand) {

            query.brand = {
                $regex: brand,
                $options: "i"
            };
        }


        // Price filter
        if (minPrice || maxPrice) {

            query.monthlySubscriptionPrice = {
                ...(minPrice && {
                    $gte: Number(minPrice)
                }),

                ...(maxPrice && {
                    $lte: Number(maxPrice)
                })
            };
        }


        const total = await Car.countDocuments(query);

        const cars = await Car.find(query)
            .skip(skip)
            .limit(itemsPerPage);


        return responseHandler(
            res,
            200,
            "Available cars fetched successfully",
            {
                cars,

                pagination: {
                    total,
                    page: currentPage,
                    limit: itemsPerPage,
                    totalPages: Math.ceil(total / itemsPerPage)
                }
            }
        );

    } catch (error) {

    

        return responseHandler(
            res,
            500,
            "Server error"
        );
    }
};


export const getCarById = async (req, res) => {

    try {

        const { id } = req.params;


        const car = await Car.findById(id);


        if (!car) {

            return responseHandler(
                res,
                404,
                "Car not found"
            );
        }


        return responseHandler(
            res,
            200,
            "Car fetched successfully",
            car
        );

    } catch (error) {

        

        return responseHandler(
            res,
            500,
            "Server error"
        );
    }
};





export const updateCar = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            carName,
            brand,
            model,
            monthlySubscriptionPrice,
            registrationNumber,
            availabilityStatus
        } = req.body;


        // Find car
        const car = await Car.findById(id);

        if (!car) {

            return responseHandler(
                res,
                404,
                "Car not found"
            );
        }


        // Update only provided fields
        car.carName =
            carName ?? car.carName;

        car.brand =
            brand ?? car.brand;

        car.model =
            model ?? car.model;

        car.monthlySubscriptionPrice =
            monthlySubscriptionPrice ??
            car.monthlySubscriptionPrice;

        car.registrationNumber =
            registrationNumber ??
            car.registrationNumber;

        car.availabilityStatus =
            availabilityStatus ??
            car.availabilityStatus;


        

        if (req.files && req.files.length > 0) {

            // Delete old images from Cloudinary
            if (car.image && car.image.length > 0) {

                for (const imageUrl of car.image) {

                    await deleteCloudinaryImage(
                        imageUrl
                    );
                }
            }


            // Upload new images
            const newImages = [];

            for (const file of req.files) {

                const result =
                    await uploadToCloudinary(
                        file.buffer,
                        "car-subscription/cars"
                    );

                newImages.push(
                    result.secure_url
                );
            }


            // Replace old images with new images
            car.image = newImages;
        }


        // Save updated car
        await car.save();


        return responseHandler(
            res,
            200,
            "Car updated successfully",
            car
        );

    } catch (error) {

        // console.log(
        //     "UPDATE CAR ERROR:",
        //     error
        // );

        return responseHandler(
            res,
            500,
            "Server error"
        );
    }
};



export const deleteCar = async (req, res) => {

    try {

        const { id } = req.params;

        const car = await Car.findById(id);

        if (!car) {

            return responseHandler(
                res,
                404,
                "Car not found"
            );
        }


        // Delete car images from Cloudinary
        if (car.image && car.image.length > 0) {

            for (const imageUrl of car.image) {

                await deleteCloudinaryImage(
                    imageUrl
                );
            }
        }


        // Delete car from MongoDB
        await Car.findByIdAndDelete(id);


        return responseHandler(
            res,
            200,
            "Car deleted successfully"
        );

    } catch (error) {

        console.log(
            "DELETE CAR ERROR:",
            error
        );

        return responseHandler(
            res,
            500,
            "Server error"
        );
    }
};