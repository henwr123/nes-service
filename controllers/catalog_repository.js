const Repository = require('./repository')

class CatalogRepository extends Repository {

    /**
     * Create an instance of the Catalog Repository object for DB access
     * @param {*} dao 
     */
    constructor(dao) {
        super(dao)
        this.SELECT_STATEMENT = `SELECT * FROM games`
        this.PRIMARY_KEY = `catalog_id`
        this.DEFAULT_SORT = `title`
    }

}

module.exports = CatalogRepository;