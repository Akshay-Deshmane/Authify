import app from "./src/app.js";
import connectDB from "./src/config/database.js";

connectDB();

app.listen(3000, () => {
    console.log("server is started successfully")
})