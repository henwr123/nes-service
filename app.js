const Promise = require('bluebird')
const AppDAO = require('./controllers/dao')
const CatalogRepository = require('./controllers/catalog_repository')
const PublisherRepository = require('./controllers/publisher_repository')
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());


const dao = new AppDAO('./games.db')
const catalogRepo = new CatalogRepository(dao)
const publishersRepo = new PublisherRepository(dao)



/**
 * Get a single item by id
 * ex. ../games/NES-XX-USA
 */
app.get('/games/:catalog_id', (req, res) => {

    var params = [req.params.catalog_id]


    catalogRepo.getById(params).then((cat) => {

        //No results from the selection
        if (cat === undefined) {
            console.error(`❌  Games - Nothing found for id ${params}`)
            res.status(404).json({ message: `Games - nothing found for id ${params}` }).end()
            return
        }

        console.log(`✔️  Games - Found game with id ${params}`)
        res.status(200).json(cat).end()

    }).catch((err) => {

        console.log(`❌  Games - Nothing found for id ${params}`)
        console.log(JSON.stringify(err))
        res.status(404).json({ message: `Games - nothing found for id ${params}` }).end()

    })
});

/**
 * Get list of games with filtering
 */
app.get('/games', (req, res) => {

    catalogRepo.getFiltered(req.query).then((cat) => {

        console.log(`✔️  Games - Found ${cat.length} records`)

        res.status(200).json({
            count: cat.length,
            results: cat
        }).end()

    }).catch((err) => {

        console.error(`❗  Games - Error - ${err.message}`)
        res.status(400).json({ message: `Something went wrong - No games found` }).end()

    })
});



app.get('/publishers', (req, res) => {

    publishersRepo.getFiltered(req.query).then((cat) => {

        console.log(`✔️  Publishers - Found ${cat.length} records`)

        res.status(200).json({
            count: cat.length,
            results: cat
        }).end()

    }).catch((err) => {

        console.error(`❗  Publishers - Error - ${err.message}`)
        res.status(400).json({ message: `Something went wrong - No publishers found` }).end()

    })
});

app.listen(port, () => {
    console.log(`Welcome to the NES Service - service is listening on port ${port}!`);
});