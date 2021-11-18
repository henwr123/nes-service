const Repository = require('./repository')

class CatalogRepository extends Repository {

    /**
     * Create an instance of the Catalog Repository object for DB access
     * @param {*} dao 
     */
    constructor(dao) {
        super(dao)
        this.SELECT_STATEMENT = `SELECT * FROM cartdb`
    }

    /**
     * This method will fetch a single record from the database for the provide
     * catalog id.
     * @param {String} id Id for the record to select
     * @returns result from the catalog selection - one record for the catalog entry
     */
    getById(id) {
        return this.dao.get(this.SELECT_STATEMENT + ` WHERE catalog_id = ?`, [id])
    }

    /**
     * This method fetches everything in the database
     * @returns Array of results for the entire database
     */
    getAll() {
        return this.dao.all(this.SELECT_STATEMENT)
    }

    /**
     * 
     * @param {*} query Filtering criteria in the embedded format - (?field=criteria) as well as sorting criteria
     * @returns 
     */
    getFiltered(query) {

        let query1 = this.SELECT_STATEMENT + this.buildFilteringWhereClause(query) + this.buildSortingOrderBy(query, "title")

        return this.dao.all(query1)
    }

}

module.exports = CatalogRepository;