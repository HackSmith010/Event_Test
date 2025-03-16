import AuthRouter from "./routes/auth.route.js";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

const port = 3000;

app.use('/api/linkedin', AuthRouter);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});