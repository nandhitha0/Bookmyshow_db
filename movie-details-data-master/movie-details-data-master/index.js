import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectMongoDB from "./DB/connectMongoDB.js";
import movieRoutes from "./routes/movieRoutes.js";

dotenv.config();
connectMongoDB();

const app = express();
app.use(express.json());
app.use(cors({
    origin : "*"
}));

// API Endpoints
app.use('/movie', movieRoutes); // movie Routes

// app.use('/', (req, res) => {
//     res.send("This is a ' Movie ' Booking Application !!!")
// })

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
