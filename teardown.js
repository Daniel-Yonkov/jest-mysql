const debug = require("debug")("jest-mysql:teardown");
const { join } = require("path");

const { query } = require("./helpers/mysql");
const {
    databaseOptions: { database },
    truncateDatabase
} = require(join(__dirname, "globalConfig.json"));
module.exports = async function() {
    debug("Teardown Mysql");

    //removes foreing key checks in order to allow truncateing
    if (truncateDatabase) {
        debug("Staring database clearing");
        await query("SET FOREIGN_KEY_CHECKS=0");

        //truncates tables
        const { results } = await query(`
            SELECT Concat('TRUNCATE TABLE ',table_schema,'.',TABLE_NAME, ';') 
            FROM INFORMATION_SCHEMA.TABLES WHERE table_schema = "${database}"`);

        //we truncate all the databases in the test environment
        debug("Truncating tables");
        results.map(async dbResults => {
            for (const truncateQuery in dbResults) {
                await query(dbResults[truncateQuery]);
            }
        });

        //restore foreing key checks
        await query("SET FOREIGN_KEY_CHECKS=1");
        debug("Database Cleared");
    }

    debug("Stop initial mysql connection");
    global.db.end(error => {
        if (error) {
            throw error;
        }
        debug("Mysql connection terminated");
    });
};
