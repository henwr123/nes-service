class Repository {

    /**
     * Create an instance of the Repository object for DB access
     * @param {*} dao 
     */
    constructor(dao) {
        this.dao = dao
    }

    /**
     * Build the OrderBy clause based upon the provided parameters
     * @param {*} params 
     * @param {*} def 
     * @returns 
     */
    buildSortingOrderBy(params, def = 'name') {

        let sort = ""

        if (params.orderBy !== undefined) {
            sort = " ORDER BY " + params.orderBy
        } else {
            sort = " ORDER BY " + def
        }

        return sort
    }

    /**
     * Build the filtering parameters
     * @param {*} params - the req.query object 
     * @returns Filtering string
     */
    buildFilteringWhereClause(params) {

        let filter = ""

        Object.entries(params).forEach(entry => {

            let key = entry[0];
            let value = entry[1];

            // ignore the orderBy parameter
            if (key === 'orderBy') {
                return
            }

            if (filter === "") {
                filter = ` WHERE LOWER(${key}) LIKE LOWER('${value}') `
            } else {
                filter = `${filter} AND LOWER(${key}) LIKE LOWER('${value}') `
            }
        })

        return filter
    }

    /**
     * This method will fetch a single record from the database for the provide
     * catalog id.
     * @param {String} id Id for the record to select
     * @returns result from the catalog selection - one record for the catalog entry
     */
    getById(id) {
        //return this.dao.get(this.TABLE, this.PRIMARY_KEY, id)
        return this.dao.get(this.SELECT_STATEMENT + ` WHERE ${this.PRIMARY_KEY} = ?`, id)
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

        let query1 = this.SELECT_STATEMENT + this.buildFilteringWhereClause(query) + this.buildSortingOrderBy(query, this.DEFAULT_SORT)

        return this.dao.all(query1)
    }
}

module.exports = Repository;