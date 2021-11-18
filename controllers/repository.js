class Repository {

    /**
     * Create an instance of the Publisher Repository object for DB access
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
    buildSortingOrderBy(params, def = 'publisher_id') {

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
     * This method fetches everything in the database
     * @returns Array of results for the entire database
     */
    getAll() {
        return this.dao.all(this.SELECT_STATEMENT)
    }
}

module.exports = Repository;