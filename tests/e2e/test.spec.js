const { italic } = require("colors");
const request = require("supertest");
const expect = require("chai").expect;

describe("Testing the API", () => {

    const baseUrl = 'http://localhost:4321'

    /// Systems ///////////////////////////////////////////////////////////////

    const systemId = 'NES-NTSC'

    it("should be able to get list of systems", (done) => {
        request(baseUrl)
            .get('/systems')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .end((err, res) => {
                expect(res.statusCode).to.be.equal(200)
                expect(res.body.count).to.be.equal(5)
                expect(res.body.results[0].name).to.be.equal('Famicom')
                if(err) {
                    throw err
                }
                done()
            })
    })

    it("should be able to get a system", (done) => {
        request(baseUrl)
            .get('/systems/' + systemId)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .end((err, res) => {
                expect(res.statusCode).to.be.equal(200)
                if(err) {
                    throw err
                }
                done()
            })
    })

});
