const Repository = require('./repository')

class CategoryRepository extends Repository {

    /**
     * Create an instance of the Categories Repository object for DB access
     * @param {*} dao 
     */
    constructor(dao) {
        super(dao)
        this.SELECT_STATEMENT = `SELECT * FROM categories`
        this.PRIMARY_KEY = `name`
        this.DEFAULT_SORT = `name`
    }

}

module.exports = CategoryRepository;