import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import productRoutes from "./routes/product.route.js";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

const _dirname = path.resolve();

app.use(express.json()); //allows us to accept json data in the req.body

app.use("/api/products", productRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(_dirname, "/frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
    });
}

app.listen(PORT, () => {
    connectDB();
    console.log("Server started at http://localhost:" + PORT);
});

// qV7sa3c9TBdI6qRH