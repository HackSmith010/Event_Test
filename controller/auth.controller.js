// auth.controller.js
const getAcessToken = async(code) => {
    const params = new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        client_id:'78psg7r0writst',
        client_secret:'WPL_AP1.zNmpoOvDC7pXu7Ge.pLCdvQ==',
        redirect_uri:"http://192.168.27.225:3000/api/linkedin/callback",
    })
    const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:params.toString(),
    })
    if(!response.ok) {
        throw new Error(response.statusText);
    }
    const accessToken = await response.json();
    return accessToken
}

const getUserData = async(accessToken) => {
    const respose = await fetch('https://api.linkedin.com/v2/userinfo', {
        method: 'GET',
        headers: {
            Authorization:`Bearer ${accessToken}`
        }
    })
    if(!respose.ok) {
        throw new Error(respose.statusText);
    }
    
    const userData = await respose.json();
    return userData
}

export const linkedInCallback = async (req, res) => {
    try {
        const {code} = req.query;
        //get access Token
        const accessToken = await getAcessToken(code);

        //get user data using access token
        const userData = await getUserData(accessToken.access_token);

        // For React Native app, we can handle both redirect and JSON response
        const isNativeApp = req.get('User-Agent')?.includes('Expo') || 
                           req.get('User-Agent')?.includes('okhttp');

        if (isNativeApp) {
            // Return JSON for the React Native app
            return res.status(200).json({
                success: true,
                userData
            });
        } else {
            // For web browser, redirect with the data
            // Create a success page that will close the browser and return to the app
            const htmlResponse = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>LinkedIn Authentication Successful</title>
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <style>
                    body { font-family: Arial, sans-serif; text-align: center; padding: 40px 20px; }
                    .success { color: #2563EB; font-size: 18px; margin-bottom: 20px; }
                </style>
            </head>
            <body>
                <h2 class="success">Authentication Successful!</h2>
                <p>You may close this window and return to the app.</p>
                <script>
                    // This will help close the browser window
                    setTimeout(function() {
                        window.close();
                    }, 2000);
                </script>
            </body>
            </html>
            `;
            
            res.setHeader('Content-Type', 'text/html');
            return res.send(htmlResponse);
        }
    } catch (error) {
        console.error('LinkedIn OAuth Error:', error);
        
        // Check if it's a request from native app
        const isNativeApp = req.get('User-Agent')?.includes('Expo') || 
                           req.get('User-Agent')?.includes('okhttp');
                           
        if (isNativeApp) {
            return res.status(500).json({ 
                success: false, 
                error: error.message 
            });
        } else {
            // Send error HTML for browser
            const errorHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Authentication Error</title>
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <style>
                    body { font-family: Arial, sans-serif; text-align: center; padding: 40px 20px; }
                    .error { color: #DC2626; font-size: 18px; margin-bottom: 20px; }
                </style>
            </head>
            <body>
                <h2 class="error">Authentication Failed</h2>
                <p>${error.message || 'An error occurred during authentication.'}</p>
                <p>Please close this window and try again.</p>
                <script>
                    setTimeout(function() {
                        window.close();
                    }, 3000);
                </script>
            </body>
            </html>
            `;
            
            res.setHeader('Content-Type', 'text/html');
            return res.status(500).send(errorHtml);
        }
    }
}