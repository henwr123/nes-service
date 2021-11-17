const sqlite3 = require('sqlite3')
const Promise = require('bluebird')


class AppDAO {

    /**
     * Create the instance 
     * @param {*} dbFilePath 
     */
    constructor(dbFilePath) {
        this.db = new sqlite3.Database(dbFilePath, (err) => {
            if (err) {
                console.error('Error opening database: ${ err.message }')
            }
        })
    }

    /**
     * Executes a general SQL statement
     * @param {*} sql SQL statement
     * @param {*} params Parameter
     * @returns Promise
     */
    run(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function (err) {
                if (err) {
                    console.log(err)
                    reject(err)
                } else {
                    resolve({ id: this.lastID })
                }
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
            this.db.get(sql, params, (err, result) => {
                if (err) {
                    console.log(err)
                    reject(err)
                } else {
                    resolve(result)
                }
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
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    console.log(err)
                    reject(err)
                } else {
                    resolve(rows)
                }
            })
        })
    }

}

module.exports = AppDAO