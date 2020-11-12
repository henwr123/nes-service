const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const games = require('./mock-games');


const app = express();
const port = 3000;
const catalog = games;

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


/**
 * Get list of games with filtering
 */
app.get('/games', (req, res) => {

    if(req.query.name){
        res.send(catalog.filter((game) => game.name.toLowerCase().includes(req.query.name.toLowerCase())));
    } else {
        res.send(catalog);
    }
});

app.listen(port, () => {
    console.log(`Welcome to the NES Service - service is listening on port ${port}!`);
});