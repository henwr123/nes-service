const Repository = require('./repository')

class SystemRepository extends Repository {

    /**
     * Create an instance of the Systems Repository object for DB access
     * @param {*} dao 
     */
    constructor(dao) {
        super(dao)
        this.SELECT_STATEMENT = `SELECT * FROM systems`
        this.PRIMARY_KEY = `name`
        this.DEFAULT_SORT = `name`
    }

}

module.exports = SystemRepository;