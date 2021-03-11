const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json());

DATA = {
    'client0token': 'client0@email.com',
    'client1token': 'client1@email.com',
}

app.post('/validate', (req, res) => {
    const data = req.body;
    if (!data['token']) {
        res.status(400).send({
            message: "Missing token"
        });
    } else {
        if (DATA[data.token]) {
            // match found, reply true and id
            res.status(200).send({
                result: true,
                id: DATA[data.token]
            });
        } else {
            // no match, reply false nad no id
            res.status(200).send({
                result: false
            });
        }
    }
});

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