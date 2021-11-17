
/**
 * Build the filtering parameters
 * @param {*} params - the req.query object 
 * @returns Filtering string
 */
 function buildFilteringWhereClause(params) {

    let filter = ""

    Object.entries(params).forEach(entry => {

        let key = entry[0];
        let value = entry[1];

        // ignore the orderBy parameter
        if (key === 'orderBy' || key === 'orderDir') {
            return
        }

        if (filter === "") {
            filter = ' WHERE ' + key + ' LIKE "' + value + '" '
        } else {
            filter = filter + 'AND ' + key + ' LIKE "' + value + '" '
        }
    })

    return filter
}

/**
 * Build the OrderBy clause based upon the provided parameters
 * @param {*} params 
 * @param {*} def 
 * @returns 
 */
 function buildSortingOrderBy(params, def = 'publisher_id') {

    let sort = ""

    if (params.orderBy !== undefined) {
        sort = " ORDER BY " + params.orderBy
    } else {
        sort = " ORDER BY " + def
    }

    // do not apply the order direction if a sorting property was not applied
    if (params.orderDir !== undefined && params.orderBy !== undefined) {
        sort = sort + " " + params.orderDir
    }
    return sort
}


class PublisherRepository {

    /**
     * Create an instance of the Publisher Repository object for DB access
     * @param {*} dao 
     */
    constructor(dao) {
        this.dao = dao
        this.SELECT_STATEMENT = `SELECT * FROM publishers`
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

        let query1 = this.SELECT_STATEMENT + buildFilteringWhereClause(query) + buildSortingOrderBy(query, "name")

        return this.dao.all(query1)
    }

}

module.exports = PublisherRepository;