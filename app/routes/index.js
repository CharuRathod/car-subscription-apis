
import userRoutes from "./userRoutes.js";
import carRoutes from "./carRoutes.js";
import subscriptionRoutes from "./subscriptionRoutes.js";


export default(app)=>{

app.use("/api/users", userRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/subscriptions", subscriptionRoutes);

}
