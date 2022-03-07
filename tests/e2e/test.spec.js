const { italic } = require("colors")
const request = require("supertest")
const expect = require("chai").expect
const assert = require('chai').assert

const baseUrl = 'http://localhost:4321'


const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

const runTestList = (entity, listCount, listFirstItem) => {

    it(`${capitalize(entity)} - should be able to get list`, (done) => {
        request(baseUrl)
            .get('/' + entity)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .end((err, res) => {
                expect(res.statusCode).to.be.equal(200)
                expect(res.body.count).to.be.equal(listCount)
                expect(res.body.results[0].name).to.be.equal(listFirstItem)
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
 */
const runTestGetItem = (entity, id) => {

    it(`${capitalize(entity)} - should be able to get an item`, (done) => {
        request(baseUrl)
            .get('/' + entity + '/' + id)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .end((err, res) => {
                expect(res.statusCode).to.be.equal(200)
                expect(res.body.name).to.be.equal(id)
                if(err) {
                    throw err
                }
                done()
            })
    })

}

describe("Testing the nes-service API - Get Data", () => {


    /// Systems ///////////////////////////////////////////////////////////////

    const systemId = 'NES-NTSC'
    const systemFirstItem = 'Famicom'

    context('System Tests', () => {
        runTestList('systems', 5, systemFirstItem)
        runTestGetItem('systems', systemId)
    })


    /// Boards ///////////////////////////////////////////////////////////////

    const boardId = 'HVC-CNROM'
    const boardFirstItem = 'ACCLAIM-AOROM'

    context('Board Tests', () => {
        runTestList('boards', 67, boardFirstItem)
        runTestGetItem('boards', boardId)


        it("Boards - should be able to filter by value", (done) => {
            request(baseUrl)
                .get('/boards/?name=' + boardId)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .end((err, res) => {
                    expect(res.statusCode).to.be.equal(200)
                    expect(res.body.count).to.be.equal(1)
                    expect(res.body.results[0].name).to.be.equal(boardId)
                    if(err) {
                        throw err
                    }
                    done()
                })
        })

        it("Boards - should be able to filter by pattern", (done) => {
            request(baseUrl)
                .get('/boards/?name=%An%')
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .end((err, res) => {
                    expect(res.statusCode).to.be.equal(200)
                    expect(res.body.count).to.be.equal(2)
                    //expect(res.body.results).to.match(/an/gmi)
                    if(err) {
                        throw err
                    }
                    done()
                })
        })

    })

})
