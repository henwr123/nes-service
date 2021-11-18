const Repository = require('./repository')

class BoardRepository extends Repository {

    /**
     * Create an instance of the Boards Repository object for DB access
     * @param {*} dao 
     */
    constructor(dao) {
        super(dao)
        this.SELECT_STATEMENT = `SELECT * FROM boards`
        this.PRIMARY_KEY = `name`
        this.DEFAULT_SORT = `name`
    }

}

module.exports = BoardRepository;