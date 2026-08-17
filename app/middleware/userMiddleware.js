import jwt from "jsonwebtoken";
import { responseHandler } from "../utils/responseHandler.js";

const userMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return responseHandler(res,401,"Authorization token required");
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return responseHandler(res,401,"Token required");
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );


        req.user = decoded;

        next();

    } catch (error) {

        return responseHandler(res,401,"Invalid or expired token");
    }
};

export default userMiddleware;