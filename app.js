const Promise = require('bluebird')
const AppDAO = require('./dao')
const CatalogRepository = require('./catalog_repository')
const express = require('express');
//const sqlite3 = require('sqlite3')
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const dao = new AppDAO('./games.db')
const catalogRepo = new CatalogRepository(dao)



// const db = new sqlite3.Database('./games.db', (err) => {
//     if (err) {
//         console.error('Error opening database: ${ err.message }')
//     }
// })



// /**
//  * Build the filtering parameters
//  * @param {*} params - the req.query object 
//  * @returns Filtering string
//  */
// function buildFilteringWhereClause(params) {

//     let filter = ""

//     Object.entries(params).forEach(entry => {

//         let key = entry[0];
//         let value = entry[1];

//         // ignore the orderBy parameter
//         if (key === 'orderBy' || key === 'orderDir') {
//             return
//         }

//         if (filter === "") {
//             filter = ' WHERE ' + key + ' LIKE "' + value + '" '
//         } else {
//             filter = filter + 'AND ' + key + ' LIKE "' + value + '" '
//         }
//     })

//     return filter
// }

// /**
//  * Build the OrderBy clause based upon the provided parameters
//  * @param {*} params 
//  * @param {*} def 
//  * @returns 
//  */
// function buildSortingOrderBy(params, def = 'catalog_id') {

//     let sort = ""

//     if (params.orderBy !== undefined) {
//         sort = " ORDER BY " + params.orderBy
//     } else {
//         sort = " ORDER BY " + def
//     }

//     // do not apply the order direction if a sorting property was not applied
//     if (params.orderDir !== undefined && params.orderBy !== undefined) {
//         sort = sort + " " + params.orderDir
//     }
//     return sort
// }



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
});

app.listen(port, () => {
    console.log(`Welcome to the NES Service - service is listening on port ${port}!`);
});