const Promise = require('bluebird')
const AppDAO = require('./dao')
const CatalogRepository = require('./catalog_repository')
const express = require('express');
const sqlite3 = require('sqlite3')
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const dao = new AppDAO('./games.db')
const catalogRepo = new CatalogRepository(dao)



const db = new sqlite3.Database('./games.db', (err) => {
    if (err) {
        console.error('Error opening database: ${ err.message }')
    }
})



/**
 * Build the filtering parameters
 * @param {*} params - the req.query object 
 * @returns Filtering string
 */
function buildFilteringWhereClause(params) {

    let filter = ""

    Object.entries(params).forEach(entry => {

        let key = entry[0];
        let value = entry[1];

        // ignore the orderBy parameter
        if (key === 'orderBy' || key === 'orderDir') {
            return
        }

        if (filter === "") {
            filter = ' WHERE ' + key + ' LIKE "' + value + '" '
        } else {
            filter = filter + 'AND ' + key + ' LIKE "' + value + '" '
        }
    })

    return filter
}

/**
 * Build the OrderBy clause based upon the provided parameters
 * @param {*} params 
 * @param {*} def 
 * @returns 
 */
function buildSortingOrderBy(params, def = 'catalog_id') {

    let sort = ""

    if (params.orderBy !== undefined) {
        sort = " ORDER BY " + params.orderBy
    } else {
        sort = " ORDER BY " + def
    }

    // do not apply the order direction if a sorting property was not applied
    if (params.orderDir !== undefined && params.orderBy !== undefined) {
        sort = sort + " " + params.orderDir
    }
    return sort
}



/**
 * Get a single item by id
 * ex. ../games/NES-XX-USA
 */
app.get('/games/:catalog_id', (req, res) => {


    var params = [req.params.catalog_id]


    catalogRepo.getById(params).then((cat) => {

        res.status(200).json(cat).end()

    }).catch((err) => {

        console.log(`❌  Games - Nothing found for id ${params}`)
        console.log(JSON.stringify(err))
        res.status(404).json({ message: `Games - nothing found for id ${params}` }).end()

    })




    // db.get("SELECT * FROM cartdb WHERE catalog_id = ?", params, (err, row) => {

    //     if (err) {
    //         console.error(`❗  Games - Error - ${err.message}`)
    //         res.status(400).json({ error: err.message }).end()
    //         return
    //     }

    //     // No results from the selection
    //     if (row === undefined) {
    //         console.error(`❌  Games - Nothing found for id ${params}`)
    //         res.status(404).json({ message: `Games - nothing found for id ${params}` }).end()
    //         return
    //     }

    //     // return the single result
    //     res.status(200).json(row).end()

    //     console.log(`✔️  Games - Found game with id ${params}`)
    // })

});

/**
 * Get list of games with filtering
 */
app.get('/games', (req, res) => {

    console.log(`🔎  request for games`);


    catalogRepo.getFiltered(req.query).then((cat) => {

        console.log(`✔️  Games - Found ${cat.length} records`)

        res.status(200).json({
            count: cat.length,
            results: cat
        }).end()

    }).catch((err) => {

        console.error(`❗  Games - Error - ${err.message}`)
        res.status(400).json({ error: err.message }).end()

    })




    /*     let list = catalog;
    
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
    
        console.log(` --~ found ${list.length} records`);
    
        // send the resulting list in the response
        res.send(list); */

});

app.listen(port, () => {
    console.log(`Welcome to the NES Service - service is listening on port ${port}!`);
});