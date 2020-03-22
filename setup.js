const fs = require("fs");
const { resolve, join } = require("path");
const util = require("util");
const mysql = require("mysql");
const cwd = require("cwd");
const debug = require("debug")("jest-mysql:setup");
const {
    createDatabaseIfNoneExisiting,
    importCreationScript,
    useDatabase
} = require("./fixtures/databaseSetup");
const defaultOptions = require("./jest-mysql-config");

const globalConfigPath = join(__dirname, "globalConfig.json");

module.exports = async () => {
    const {
        databaseOptions: mysqlConfig,
        createDatabase,
        dbSchema,
        truncateDatabase
    } = getTestingMysqlDatabaseOptions();

    fs.writeFileSync(
        globalConfigPath,
        JSON.stringify({
            ...defaultOptions,
            databaseOptions: mysqlConfig,
            dbSchema: dbSchema,
            truncateDatabase
        })
    );
    debug("Stored global config");

    const { database, ...options } = mysqlConfig;
    const con = mysql.createConnection(options);
    con.connect();
    global.db = con;
    debug("Established mysql connection");

    if (createDatabase) {
        debug("Database creations initialization");
        await createDatabaseIfNoneExisiting(mysqlConfig.database);
    }
    await useDatabase(database);
    debug("Connected to database");

    debug("Initialization setup database");
    //TODO move guard logic into creation script
    if (dbSchema && fs.existsSync(resolve(cwd(), dbSchema))) {
        await importCreationScript(mysqlConfig, dbSchema);
        debug("Imported database schema");
    } else {
        debug("Unable to locate database schema");
    }
    await loadSetupHooks();
};
//TODO import default supported options and override with the user provided
function getTestingMysqlDatabaseOptions() {
    try {
        const databaseOptions = require(resolve(cwd(), "jest-mysql-config.js"));
        return databaseOptions;
    } catch (e) {
        throw new Error("Unable to find and import testing database config");
    }
}

async function loadSetupHooks() {
    debug("Checking for user defined setup hooks...");
    try {
        const setupHooks = require(resolve(cwd(), "setupHooks"));
        if (Object.keys(setupHooks).length > 0) {
            for (let action in setupHooks) {
                if (util.types.isAsyncFunction(setupHooks[action])) {
                    await setupHooks[action]();
                }
                debug("Imported setup hooks");
                return;
            }
        }
        debug("No setup hooks provided");
    } catch (e) {
        debug("Unable to load setup hooks");
    }
}
