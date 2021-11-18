const Repository = require('./repository')

class PublisherRepository extends Repository {

    /**
     * Create an instance of the Publisher Repository object for DB access
     * @param {*} dao 
     */
    constructor(dao) {
        super(dao)
        this.SELECT_STATEMENT = `SELECT * FROM publishers`
        this.PRIMARY_KEY = `name`
        this.DEFAULT_SORT = `name`
    }

}

module.exports = PublisherRepository;