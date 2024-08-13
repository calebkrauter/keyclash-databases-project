// JWT was implemented in large part through use of: https://www.geeksforgeeks.org/jwt-authentication-with-node-js/
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const { app, express, port } = require('../../server');

// Generate JWT token for user
app.post('/api/generateUserToken', (req, res) => {
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    try {
        const { email, password_hash } = req.body;
        const token = jwt.sign(
            { email, password_hash },
            jwtSecretKey
        );
        res.json({ token });
    } catch (error) {
        console.error('Error generating token:', error);
        res.status(500).json({ error: 'Failed to generate token' })
    }

});

// Validate JWT token for user
app.get('/api/validateUserToken', (req, res) => {
    let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
    let jwtSecretKey = process.env.JWT_SECRET_KEY;

    try {
        const token = req.header(tokenHeaderKey);
        const verified = jwt.verify(token, jwtSecretKey);
        if (verified) {
            return res.send("Successfully Verified.");
        } else {
            return res.status(401).send(error);
        }
    } catch (error) {
        return res.status(401).send(error);
    }
})