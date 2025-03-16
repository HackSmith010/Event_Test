const getAcessToken = async(code) => {
    const params = new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        client_id:'78psg7r0writst',
        client_secret:'WPL_AP1.zNmpoOvDC7pXu7Ge.pLCdvQ==',
        redirect_uri:"http://localhost:3000/api/linkedin/callback",
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

        res.status(200).json ({
            userData
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
