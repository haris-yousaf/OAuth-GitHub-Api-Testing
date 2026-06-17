const express = require('express');
const axios = require('axios');

const app = express();

const CLIENT_ID = 'Ov23lix7vmFYeefFqRuE';
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:3000/callback';

// Step 1: Redirect user to GitHub authorization page
app.get('/login', (req, res) => {
    const scope = 'repo gist user';
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${scope}`;
    console.log('Redirecting to GitHub...');
    res.redirect(githubAuthUrl);
});

// Step 2: GitHub redirects back here with a code
// Step 3: Exchange the code for an access token
app.get('/callback', async (req, res) => {
    const code = req.query.code;

    if (!code) {
        return res.status(400).send('No code received from GitHub');
    }

    console.log('Authorization code received:', code);

    try {
        const tokenResponse = await axios.post(
            'https://github.com/login/oauth/access_token',
            {
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                code: code,
                redirect_uri: REDIRECT_URI
            },
            {
                headers: { Accept: 'application/json' }
            }
        );

        const tokenData = tokenResponse.data;

        if (tokenData.error) {
            return res.status(400).json({
                error: tokenData.error,
                description: tokenData.error_description
            });
        }

        const accessToken = tokenData.access_token;
        const tokenType = tokenData.token_type;
        const scope = tokenData.scope;

        console.log('\n========================================');
        console.log('ACCESS TOKEN:', accessToken);
        console.log('TOKEN TYPE:', tokenType);
        console.log('SCOPE:', scope);
        console.log('========================================\n');
        console.log('Copy the access token above into your Postman environment.');

        res.send(`
            <h2>OAuth Flow Complete</h2>
            <p><strong>Access Token:</strong> ${accessToken}</p>
            <p><strong>Token Type:</strong> ${tokenType}</p>
            <p><strong>Scope:</strong> ${scope}</p>
            <p>Copy the access token into your Postman environment variable <code>githubToken</code></p>
        `);

    } catch (error) {
        console.error('Token exchange failed:', error.message);
        res.status(500).send('Token exchange failed: ' + error.message);
    }
});

app.listen(3000, () => {
    console.log('OAuth server running at http://localhost:3000');
    console.log('Visit http://localhost:3000/login to start the OAuth flow');
});
