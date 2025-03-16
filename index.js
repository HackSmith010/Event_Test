import AuthRouter from "./routes/auth.route.js";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Update CORS configuration to allow requests from React Native
app.use(cors({
    // Allow both your existing web origin and React Native
    origin: function(origin, callback) {
        const allowedOrigins = [
            "http://localhost:5173",  // Your web app
            "http://localhost:19000", // Expo dev client
            "http://localhost:19006", // Expo web
            "exp://192.168.x.x:19000" // Your local IP when using Expo Go
        ];
        
        // Allow requests with no origin (like mobile apps, curl requests)
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(null, false);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

const port = 3000;

app.use('/api/linkedin', AuthRouter);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});