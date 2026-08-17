import { messaging } from "../config/firebase.js";

export const sendPushNotification = async (
    token,
    title,
    body,
    data = {}
) => {
    try {
        if (!token) {
            console.log("FCM token not found");
            return;
        }

        const message = {
            token,

            notification: {
                title,
                body,
            },

            data,
        };

        const response = await messaging.send(message);

        console.log(
            "Push notification sent:",
            response
        );

        return response;

    } catch (error) {
        console.error(
            "Push notification error:",
            error.message
        );
    }
};