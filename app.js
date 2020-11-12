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


app.get('/games/:id', (req, res) => {

    const id = req.params.id;

    console.log(`request for game with id ${id}`);

    res.send(catalog.find(game => game.id === id));

});

/**
 * Get list of games with filtering
 */
app.get('/games', (req, res) => {

    console.log(`request for games`);

    if (req.query.name) {
        res.send(catalog.filter((game) => game.name.toLowerCase().includes(req.query.name.toLowerCase())));
    } else {
        res.send(catalog);
    }
});

app.listen(port, () => {
    console.log(`Welcome to the NES Service - service is listening on port ${port}!`);
});