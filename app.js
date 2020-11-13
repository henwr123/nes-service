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
 * Get a single item by id
 * ex. ../games/NES-XX-USA
 */
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

    let list = catalog;

    if (req.query.id) {
        list = list.filter((game) => game.id.toLowerCase().includes(req.query.id.toLowerCase()));
    }
    if (req.query.name) {
        list = list.filter((game) => game.name.toLowerCase().includes(req.query.name.toLowerCase()));
    }
    if (req.query.category) {
        list = list.filter((game) => game.category.toLowerCase().includes(req.query.category.toLowerCase()));
    }
    if (req.query.developer) {
        list = list.filter((game) => game.developer.toLowerCase().includes(req.query.developer.toLowerCase()));
    }
    if (req.query.publisher) {
        list = list.filter((game) => game.publisher.toLowerCase().includes(req.query.publisher.toLowerCase()));
    }
    if (req.query.ersb) {
        list = list.filter((game) => game.ersb.toLowerCase().includes(req.query.ersb.toLowerCase()));
    }
    if (req.query.upc) {
        list = list.filter((game) => game.upc.toLowerCase().includes(req.query.upc.toLowerCase()));
    }
    if (req.query.releaseDate) {
        list = list.filter((game) => game.releaseDate.toLowerCase().includes(req.query.releaseDate.toLowerCase()));
    }
    if (req.query.players) {
        list = list.filter((game) => game.players.toLowerCase().includes(req.query.players.toLowerCase()));
    }


    if (req.query.sortBy) {
        list.sort((a, b) => (a[req.query.sortBy] > b[req.query.sortBy]) ? 1 : (a[req.query.sortBy] === b[req.query.sortBy]) ? ((a.sortName > b.sortName) ? 1 : -1) : -1)
    } else {
        list.sort((a, b) => (a.sortName > b.sortName) ? 1 : -1);
    }

    console.log(` ~ found ${list.length} records`);

    // send the resulting list in the response
    res.send(list);

});

app.listen(port, () => {
    console.log(`Welcome to the NES Service - service is listening on port ${port}!`);
});