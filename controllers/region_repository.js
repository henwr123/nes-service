const Repository = require('./repository')

class RegionRepository extends Repository {

    /**
     * Create an instance of the Region Repository object for DB access
     * @param {*} dao 
     */
    constructor(dao) {
        super(dao)
        this.SELECT_STATEMENT = `SELECT * FROM regions`
        this.PRIMARY_KEY = `name`
        this.DEFAULT_SORT = `name`
    }

}

module.exports = RegionRepository;