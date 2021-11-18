
const Repository = require('./repository')


class DeveloperRepository extends Repository {

    /**
     * Create an instance of the Publisher Repository object for DB access
     * @param {*} dao 
     */
    constructor(dao) {
        super(dao)
        this.SELECT_STATEMENT = `SELECT * FROM developers`
    }

    /**
     * This method will fetch a single record from the database for the provide
     * publisher name.
     * @param {String} name Id for the record to select
     * @returns result from the publisher selection - one record for the publisher entry
     */
    getById(name) {
        return this.dao.get(this.SELECT_STATEMENT + ` WHERE name = ?`, [id])
    }

    /**
     * 
     * @param {*} query Filtering criteria in the embedded format - (?field=criteria) as well as sorting criteria
     * @returns 
     */
    getFiltered(query) {

        let query1 = this.SELECT_STATEMENT + this.buildFilteringWhereClause(query) + this.buildSortingOrderBy(query, "name")

        return this.dao.all(query1)
    }

}

module.exports = DeveloperRepository;