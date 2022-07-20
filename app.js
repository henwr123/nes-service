const express = require('express');
const cors = require('cors');
const colors = require('colors')

const app = express();
const port = process.env.PORT || 4321;

const LOG_DETAILED = true

// load the controllers for the data access
const AppDAO = require('./controllers/dao')
const CatalogRepository = require('./controllers/catalog_repository')
const PublisherRepository = require('./controllers/publisher_repository')
const DeveloperRepository = require('./controllers/developer_repository')
const RegionRepository = require('./controllers/region_repository')
const SystemRepository = require('./controllers/system_repository')
const CategoryRepository = require('./controllers/category_repository')
const BoardRepository = require('./controllers/board_repository')


app.use(cors());

app.set('trust proxy', true);


const dao = new AppDAO('./data/games.sqlite')

// create the repositories for accessing data
const catalogRepo = new CatalogRepository(dao)
const publishersRepo = new PublisherRepository(dao)
const developersRepo = new DeveloperRepository(dao)
const regionsRepo = new RegionRepository(dao)
const systemsRepo = new SystemRepository(dao)
const categoriesRepo = new CategoryRepository(dao)
const boardsRepo = new BoardRepository(dao)


/// GAMES /////////////////////////////////////////////////////////////////////
app.get('/games/:catalog_id', (req, res) => {
    callGetById(catalogRepo, "Games", req.params.catalog_id, req, res)
});

app.get('/games', (req, res) => {
    callGetFiltered(catalogRepo, "Games", req, res)
});

/// PUBLISHERS ////////////////////////////////////////////////////////////////
app.get('/publishers/:name', (req, res) => {
    callGetById(publishersRepo, "Publisher", req.params.name, req, res)
});

app.get('/publishers', (req, res) => {
    callGetFiltered(publishersRepo, "Publishers", req, res)
});

/// DEVELOPERS ////////////////////////////////////////////////////////////////
app.get('/developers/:name', (req, res) => {
    callGetById(developersRepo, "Developer", req.params.name, req, res)
});

app.get('/developers', (req, res) => {
    callGetFiltered(developersRepo, "Developers", req, res)
});

/// REGIONS ///////////////////////////////////////////////////////////////////
app.get('/regions/:name', (req, res) => {
    callGetById(regionsRepo, "Region", req.params.name, req, res)
});

app.get('/regions', (req, res) => {
    callGetFiltered(regionsRepo, "Regions", req, res)
});

/// SYSTEMS ///////////////////////////////////////////////////////////////////
app.get('/systems/:name', (req, res) => {
    callGetById(systemsRepo, "System", req.params.name, req, res)
});

app.get('/systems', (req, res) => {
    callGetFiltered(systemsRepo, "Systems", req, res)
});

/// CATEGORIES ////////////////////////////////////////////////////////////////
app.get('/categories/:name', (req, res) => {
    callGetById(categoriesRepo, "Category", req.params.name, req, res)
});

app.get('/categories', (req, res) => {
    callGetFiltered(categoriesRepo, "Categories", req, res)
});

/// BOARDS ////////////////////////////////////////////////////////////////////
app.get('/boards/:name', (req, res) => {
    callGetById(boardsRepo, "Board", req.params.name, req, res)
});

app.get('/boards', (req, res) => {
    callGetFiltered(boardsRepo, "Boards", req, res)
});





app.listen(port, () => {
    console.log(`Welcome to the NES Service - service is listening on port ${port}!`.blue.bold.underline);
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
    
    // source: https://stackfame.com/get-ip-address-node
    var ip = req.header('x-forwarded-for') || req.connection.remoteAddress

    repo.getFiltered(req.query).then((cat) => {

        logging_handle(`✅ ${name} - Found ${cat.length} records`.black, req)

        res.status(200).json({
            count: cat.length,
            results: cat
        }).end()

    }).catch((err) => {

        logging_handle(`❗ ${name} - Error - ${err.message}`.brightRed, req)
        res.status(400).json({ message: `Something went wrong - No ${name.toLowerCase()} found` }).end()

    })
}

/**
 * This method will encapsulate the process for fetching the single record for the provide key
 * @param {*} repo Repository object
 * @param {string} name Database object name
 * @param {*} id Primary table key
 * @param {*} res Response object
 */
function callGetById(repo, name, id, req, res) {

    let params = [id]

    repo.getById(params).then((cat) => {

        //No results from the selection
        if (cat === undefined) {
            logging_handle(`❌ ${name} - Nothing found for id ${params}`.brightCyan, req)
            res.status(404).json({ message: `${name} - nothing found for id ${params}` }).end()
            return
        }

        logging_handle(`✅ ${name} - Found ${name.toLowerCase()} with id ${params}`, req)
        res.status(200).json(cat).end()

    }).catch((err) => {

        logging_handle(`❌ ${name} - Nothing found for id ${params}`, req)
        console.log(JSON.stringify(err))
        res.status(404).json({ message: `${name} - nothing found for id ${params}` }).end()

    })
}

/**
 * Manage the messages and will display additional information if the LOG_DETAILED is true
 * @param {*} message 
 * @param {*} req 
 */
function logging_handle(message, req) {

    console.log(message)

    if(LOG_DETAILED)
    {
        // source: https://stackfame.com/get-ip-address-node
        var ip = req.ip || req.header('x-forwarded-for') || req.connection.remoteAddress

        console.log(`   🔎 IP Address [ ${ip} ]`)
        console.log(`   🔎 METHOD ${req.method}`)
        console.log(`   🔎 Path ${req.path}`)
        console.log(`   🔎 Agent ${req.get('User-Agent')}`)

    }

}