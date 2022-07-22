const Promise = require('bluebird')
const config = require('../config')



class AppDAO {

    /**
     * Create the instance 
     * @param {*} dbFilePath 
     */
    constructor() {
        
        this.db = require('knex')({
            client: 'pg',
            connection: {
              host : config.db.host,
              user : config.db.user,
              password : config.db.password,
            },
          });

    }

    /**
     * Executes a general SQL statement
     * @param {*} sql SQL statement
     * @param {*} params Parameter
     * @returns Promise
     */
    run(sql, params = []) {
        return new Promise((resolve, reject) => {

            this.db.schema.raw(sql, params)
                .then(results => {
                    resolve(results.rows)
                })
                .catch(err => {
                    console.log(err)
                    reject(err)
                })
        })
    }

    /**
     * This method returns a Promise for a single value for the given key provided.
     * If no values are found, an error is returned
     * @param {*} sql SQL statement for the selection
     * @param {*} params Parameter - expect a single ID value 
     * @returns Promise and a single record set for the selection
     */
    get(sql, params = []) {
        return new Promise((resolve, reject) => {

            this.db.schema.raw(sql, params)
                .then(results => {
                    resolve(results.rows[0])
                })
                .catch(err => {
                    console.log(err)
                    reject(err)
                })
        })
    }

    /**
     * Returns a Promise for the array of record results based upon the SQL statement and parameters
     * provided.  An empty set will be returned if no records match.
     * @param {*} sql SQL statement to execute
     * @param {*} params Aray of parameters
     * @returns Results of the SQL statement as an array
     */
    all(sql, params = []) {
        return new Promise((resolve, reject) => {

            this.db.schema.raw(sql, params)
                .then(results => {
                    resolve(results.rows)
                })
                .catch(err => {
                    console.log(err)
                    reject(err)
                })
        })
    }

}

module.exports = AppDAO