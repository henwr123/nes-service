const request = require("supertest")
const expect = require("chai").expect
const assert = require('chai').assert

const baseUrl = 'http://localhost:4321'

let id = ''
let entity = ''
let property = ''
let firstItem = ''
let lastItem = ''

describe("Testing the nes-service API - Get Data", () => {

    /// Systems ///////////////////////////////////////////////////////////////

    id = 'NES-NTSC'
    entity = 'systems'
    property = 'name'
    firstItem = 'Famicom'
    lastItem = 'NES-PAL-B'

    context('System Tests', () => {

        runTestList(entity, 5, property, firstItem)
        runTestGetItem(entity, id, property)
        runTestFilterByValue(entity, id, property)
        runTestFilterByPattern(entity, 'pAl', property, 3)
        runTestSorting(entity, 'name', 'desc', lastItem)
        runTestSorting(entity, 'name', 'asc', firstItem)

    })


    /// Boards ///////////////////////////////////////////////////////////////

    id = 'HVC-CNROM'
    entity = 'boards'
    property = 'name'
    firstItem = 'ACCLAIM-AOROM'
    lastItem = 'VIRGIN-SNROM'

    context('Board Tests', () => {

        runTestList(entity, 67, property, firstItem)
        runTestGetItem(entity, id, property)
        runTestFilterByValue(entity, id, property)
        runTestFilterByPattern(entity, 'An', property, 2)
        runTestSorting(entity, 'name', 'desc', lastItem)
        runTestSorting(entity, 'name', 'asc', firstItem)

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

    it(`${capitalize(entity)} - should be able to get list`, (done) => {
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

    it(`${capitalize(entity)} - should be able to get an item`, (done) => {
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

    it(`${capitalize(entity)} - should be able to filter by value`, (done) => {
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

    it(`${capitalize(entity)} - should be able to filter by pattern`, (done) => {
        request(baseUrl)
        .get('/' + entity +  '/?' + property + '=' + searchPattern)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .end((err, res) => {
                expect(res.statusCode).to.be.equal(200)
                expect(res.body.count).to.be.equal(matches)
                res.body.results.forEach(game => {
                    expect(game.name).to.match(patternRegExp)
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

    it(`${capitalize(entity)} - should be able to sort ${direction}`, (done) => {
        request(baseUrl)
            .get('/' + entity + '?orderBy=' + sortProperty + ' ' + direction)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .end((err, res) => {
                expect(res.statusCode).to.be.equal(200)
                expect(res.body.results[0][property]).to.be.equal(listFirstItem)
                if(err) {
                    throw err
                }
                done()
            })
    })

}