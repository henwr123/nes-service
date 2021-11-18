const AppDAO = require('./controllers/dao')
const CatalogRepository = require('./controllers/catalog_repository')
const PublisherRepository = require('./controllers/publisher_repository')
const DeveloperRepository = require('./controllers/developer_repository')
const RegionRepository = require('./controllers/region_repository')
const SystemRepository = require('./controllers/system_repository')

const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());


const dao = new AppDAO('./games.db')

const catalogRepo = new CatalogRepository(dao)
const publishersRepo = new PublisherRepository(dao)
const developersRepo = new DeveloperRepository(dao)
const regionsRepo = new RegionRepository(dao)
const systemsRepo = new SystemRepository(dao)


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
    callGetFiltered(catalogRepo, "Games", req, res)
});


app.get('/publishers', (req, res) => {
    callGetFiltered(publishersRepo, "Publishers", req, res)
});


app.get('/developers', (req, res) => {
    callGetFiltered(developersRepo, "Developers", req, res)
});


app.get('/regions', (req, res) => {
    callGetFiltered(regionsRepo, "Regions", req, res)
});


app.get('/systems', (req, res) => {
    callGetFiltered(systemsRepo, "Systems", req, res)
});



app.listen(port, () => {
    console.log(`Welcome to the NES Service - service is listening on port ${port}!`);
});




/**
 * This method will encapsulate the process for calling to get a filtered
 * list of DB objects
 * @param {*} repo Repository object with a getFiltered method
 * @param {string} name Name of the DB object for the logging
 * @param {*} req Request object
 * @param {*} res Response object
 */
function callGetFiltered(repo, name, req, res) {

    repo.getFiltered(req.query).then((cat) => {

        console.log(`✔️  ${name} - Found ${cat.length} records`)

        res.status(200).json({
            count: cat.length,
            results: cat
        }).end()

    }).catch((err) => {

        console.error(`❗  ${name} - Error - ${err.message}`)
        res.status(400).json({ message: `Something went wrong - No ${name} found` }).end()

    })
}