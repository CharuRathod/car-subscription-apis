import sharp from "sharp";
import fs from "fs";
import path from "path";

const sharpMiddleware = async (req, res, next) => {

    try {

        // Check images
        if (!req.files || req.files.length === 0) {
            return next();
        }

        // Process every image
        for (const file of req.files) {

            const originalPath = file.path;

            const directory = path.dirname(originalPath);

            const webpFileName =
                `car-${Date.now()}-${Math.round(Math.random() * 10000)}.webp`;

            const webpPath =
                path.join(directory, webpFileName);


            // Convert image to WebP
            await sharp(originalPath)
                .webp({
                    quality: 80
                })
                .toFile(webpPath);


            // Delete original image
            fs.unlinkSync(originalPath);


            // Update file information
            file.filename = webpFileName;
            file.path = webpPath;
        }


        next();

    } catch (error) {

        console.log("SHARP ERROR:", error);

        return res.status(500).json({
            message: "Image processing failed"
        });
    }
};

export default sharpMiddleware;