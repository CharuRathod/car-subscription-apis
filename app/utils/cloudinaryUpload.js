import cloudinary from "../config/cloudinary.js";


export const uploadToCloudinary = (fileBuffer, folder) => {


    return new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                format: "webp",
                quality: "auto"
            },
            (error, result) => {

                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );

        stream.end(fileBuffer);
    });
};




export const deleteCloudinaryImage = async (imageUrl) => {

    try {


        const parts = imageUrl.split("/upload/");

        if (parts.length !== 2) {
            throw new Error("Invalid Cloudinary URL");
        }

        let publicId = parts[1];

        publicId = publicId.split("/").pop();

        publicId = publicId.replace(/^v\d+\//, "");

        publicId = publicId.replace(/\.[^/.]+$/, "");
      
        const urlParts = imageUrl.split("/upload/")[1];

        let cleanPublicId = urlParts.replace(/^v\d+\//, "");

        cleanPublicId = cleanPublicId.replace(  /\.[^/.]+$/,"" );

        const result = await cloudinary.uploader.destroy(cleanPublicId);

        return result;

    } catch (error) {throw error;}
};
