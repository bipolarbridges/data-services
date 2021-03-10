
AUTH_VALID_EMAIL = 'test@email.com';
AUTH_VALID_TOKEN= 'abcdefghijklmnop';


const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/validate', (req, res) => {
    const data = req.body;
    if (!data['token'] || !data['email']) {
        res.status(400).send({
            message: "Missing fields"
        });
    } else {
        if (
                data.token === AUTH_VALID_TOKEN &&
                data.email === AUTH_VALID_EMAIL) {
            res.status(200).send({
                result: true
            });
        } else {
            res.status(200).send({
                result: false
            });
        }
    }
});

module.exports = {
    AUTH_VALID_EMAIL,
    AUTH_VALID_TOKEN
};

const port = 4000;
const host = '127.0.0.1';

const server = app.listen(port, host, () => {
    console.log(`Mock auth server listening at http://${host}:${port}`)
});

process.on('SIGINT', async () => {
    server.close(() => {
        console.log("\n\nBye.");
        process.exit();
    });
});