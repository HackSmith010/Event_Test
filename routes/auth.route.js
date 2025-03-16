import express from 'express';
import { linkedInCallback } from "../controller/auth.controller.js";

const AuthRouter = express.Router();

// Handle the callback from LinkedIn OAuth
AuthRouter.get('/callback', linkedInCallback);

// Add an endpoint to get LinkedIn authorization URL
AuthRouter.get('/auth', (req, res) => {
    try {
        const redirectUri = "http://192.168.27.225:3000/api/linkedin/callback";
        const clientId = "78psg7r0writst";
        const scope = "openid email profile w_member_social";
        
        // Build the authorization URL
        const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
        
        res.json({ authUrl });
    } catch (error) {
        console.error('Error generating auth URL:', error);
        res.status(500).json({ error: error.message });
    }
});

export default AuthRouter;