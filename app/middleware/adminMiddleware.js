




import { responseHandler } from "../utils/responseHandler.js";

const adminMiddleware = (req, res, next) => {



    
    if (!req.user) {
        return responseHandler(res,401,"Unauthorized");
    }


    if (req.user.role !== "admin") {

        return responseHandler(res,403,"Access Denied ! Admin Only");
    }

    next();
};

export default adminMiddleware;