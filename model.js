const mysql = require('mysql2/promise')
const dbconfig = require('./config.js').dbconfig

const model = new function() {

    this.initTable = async (tableName, maxUrlCharLen) => {
        // Initialize Connection
        con = await mysql.createConnection(dbconfig)

        if (!tableName || !maxUrlCharLen) {
            throw new Error("Internal Error")
        }

        const createTable = "CREATE TABLE " + tableName + 
        " (id INT AUTO_INCREMENT PRIMARY KEY, url VARCHAR(" + maxUrlCharLen + "))";

        await con.execute(createTable).catch((err) => 
        //Err # 1050 is Table already exists which we should ignore otherwise throw an error
        {err.errno === 1050 ? console.log("Table already exists") : (err) => {throw(err)}})
        return true
    }

    this.queryTable = async (tableName, column, columnID) => {
        // Initialize Connection
        con = await mysql.createConnection(dbconfig)

        if (!tableName || !column || !columnID) {
            throw new Error("Internal Error")
        }

        const query = "SELECT * FROM `" + tableName + "` WHERE `" + column + "` = '" + columnID + "'"
        
        const [rows] = await con.execute(query)

        return rows[0]
    }

    this.insertUrl = async (tableName, url) => {
        // Initialize Connection
        con = await mysql.createConnection(dbconfig)

        if (!tableName || !url) {
            throw new Error("Internal Error")
        }

        const query = "INSERT INTO `" + tableName + "` (url) VALUES ('" + url + "')";

        const result = await con.execute(query)

        return result[0]
    }
}

module.exports = model