const request = require("supertest")
const expect = require("chai").expect

const baseUrl = 'http://localhost:4321'

// test setups
const test_setup = [
    {
        entity: 'systems',
        property: 'name',
        fullListSize: 5,
        id: 'NES-NTSC',
        firstItem: 'Famicom',
        lastItem: 'NES-PAL-B',
        pattern: 'pAl',
        patternMatchSize: 3
    },
    {
        entity: 'boards',
        property: 'name',
        fullListSize: 67,
        id: 'HVC-CNROM',
        firstItem: 'ACCLAIM-AOROM',
        lastItem: 'VIRGIN-SNROM',
        pattern: 'An',
        patternMatchSize: 2
    },
    {
        entity: 'regions',
        property: 'name',
        fullListSize: 15,
        id: 'Brazil',
        firstItem: 'Australia',
        lastItem: 'United Kingdom',
        pattern: 'An',
        patternMatchSize: 7
    },
    {
        entity: 'publishers',
        property: 'name',
        fullListSize: 149,
        id: 'Brøderbund',
        firstItem: 'A Wave',
        lastItem: 'dB-SOFT',
        pattern: 'SoFtWaRe',
        patternMatchSize: 4
    },
    {
        entity: 'developers',
        property: 'name',
        fullListSize: 229,
        id: 'Brøderbund',
        firstItem: 'A.I',
        lastItem: 'dB-SOFT',
        pattern: 'SoFtWaRe',
        patternMatchSize: 15
    },
    {
        entity: 'categories',
        property: 'name',
        fullListSize: 15,
        id: 'Programmable',
        firstItem: 'Action & Adventure',
        lastItem: 'Strategy',
        pattern: 'eR',
        patternMatchSize: 2
    },
    {
        entity: 'games',
        property: 'title',
        fullListSize: 2388,
        key: 'catalog_id',
        id: 'NES-MT-USA',
        firstItem: 1942,
        lastItem: 'Zunou Senkan Galg',
        pattern: 'mArIo',
        patternMatchSize: 42
    }
]

// Execute the tests
describe("Testing the nes-service API - Get Data", () => {

    test_setup.forEach((test, index) => {

        context(`${++index}. ${capitalize(test.entity)} Tests`, () => {

            runTestList(test.entity, test.fullListSize, test.property, test.firstItem)
            runTestGetItem(test.entity, test.id, test.hasOwnProperty('key') ? test.key : test.property)
            runTestFilterByValue(test.entity, test.id, test.hasOwnProperty('key') ? test.key : test.property)
            runTestFilterByPattern(test.entity, test.pattern, test.property, test.patternMatchSize)
            runTestSorting(test.entity, test.property, 'desc', test.lastItem)
            runTestSorting(test.entity, test.property, 'asc', test.firstItem)

        })
    })
})


/**
 * This function will capitilize the first character of the provided string
 * @param {string} s String to capitilize
 * @returns capitalized string
 */
 function capitalize(s) {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}

/**
 * 
 * @param {string} entity Entity name
 * @param {int} listCount Expected number of records for test
 * @param {string} property Name of property involved
 * @param {string} listFirstItem The first item 
 */
function runTestList(entity, listCount, property, listFirstItem) {

    it(`${capitalize(entity)} - should be able to get list of ${listCount} items`, (done) => {
        request(baseUrl)
            .get('/' + entity)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .end((err, res) => {
                expect(res.statusCode).to.be.equal(200)
                expect(res.body.count).to.be.equal(listCount)
                expect(res.body.results[0][property]).to.be.equal(listFirstItem)
                if(err) {
                    throw err
                }
                done()
            })
    })
}

/**
 * Test to get a specific item
 * @param {string} entity name of the entity
 * @param {string} id item to get
 * @param {string} property Name of property involved
 */
function runTestGetItem(entity, id, property) {

    it(`${capitalize(entity)} - should be able to get an item value '${id}' for property '${property}'`, (done) => {
        request(baseUrl)
            .get('/' + entity + '/' + id)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .end((err, res) => {
                expect(res.statusCode).to.be.equal(200)
                expect(res.body[property]).to.be.equal(id)
                if(err) {
                    throw err
                }
                done()
            })
    })
}

/**
 * Filter the provided entity for the provided value - expect only one record
 * @param {string} entity Name of the entity
 * @param {string} id Value to search
 * @param {string} property Property to search 
 */
function runTestFilterByValue(entity, id, property) {

    it(`${capitalize(entity)} - should be able to filter by value '${id}' for property '${property}'`, (done) => {
        request(baseUrl)
            .get('/' + entity +  '/?' + property + '=' + id)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .end((err, res) => {
                expect(res.statusCode).to.be.equal(200)
                expect(res.body.count).to.be.equal(1)
                expect(res.body.results[0][property]).to.be.equal(id)
                if(err) {
                    throw err
                }
                done()
            })
    })
}

/**
 * Search the results for the provided pattern
 * @param {string} entity Name of the entity
 * @param {string} pattern Pattern to search for within the set
 * @param {string} property Entity property for searching
 * @param {int} matches Number of records expewcted
 */
function runTestFilterByPattern(entity, pattern, property, matches) {

    const searchPattern = `%${pattern}%`
    const patternRegExp = RegExp(pattern, 'i')

    it(`${capitalize(entity)} - should be able to filter by pattern '${pattern}' and find ${matches} records`, (done) => {
        request(baseUrl)
        .get('/' + entity +  '/?' + property + '=' + searchPattern)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .end((err, res) => {
                expect(res.statusCode).to.be.equal(200)
                expect(res.body.count).to.be.equal(matches)
                res.body.results.forEach(game => {
                    expect(game[property]).to.match(patternRegExp)
                })
                if(err) {
                    throw err
                }
                done()
            })
    })
}

/**
 * Will sort the entity and check the first value for expected value
 * @param {string} entity Name of the entity
 * @param {string} sortProperty Property to sort on
 * @param {string} direction Direction of the sort - desc or asc
 * @param {string} listFirstItem Expected first item
 */
function runTestSorting(entity, sortProperty, direction, listFirstItem) {

    it(`${capitalize(entity)} - should be able to sort ${direction} on property '${sortProperty}'`, (done) => {
        request(baseUrl)
            .get('/' + entity + '?orderBy=' + sortProperty + ' ' + direction)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .end((err, res) => {
                expect(res.statusCode).to.be.equal(200)
                expect(res.body.results[0][sortProperty]).to.be.equal(listFirstItem)
                if(err) {
                    throw err
                }
                done()
            })
    })
}