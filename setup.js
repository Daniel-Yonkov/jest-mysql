const mysql = require("mysql");
const fs = require("fs");
const { resolve, join } = require("path");
const cwd = require("cwd");
const debug = require("debug")("jest-mysql:setup");

const globalConfigPath = join(__dirname, "globalConfig.json");
let setupHooks = {};
try {
    setupHooks = require(resolve(cwd(), "setupHooks"));
} catch (e) {
    debug("Unable to load setup hooks");
}

const {
    createDatabaseIfNoneExisiting,
    importCreationScript,
    useDatabase
} = require("./fixtures/databaseSetup");

module.exports = async () => {
    const {
        databaseOptions: mysqlConfig,
        createDatabase,
        dbSchema
    } = getTestingMysqlDatabaseOptions();

    fs.writeFileSync(
        globalConfigPath,
        JSON.stringify({
            databaseOptions: mysqlConfig,
            dbSchema: dbSchema
        })
    );
    debug("Stored global config");

    const { database, ...options } = mysqlConfig;
    const con = mysql.createConnection(options);
    con.connect();
    global.db = con;
    debug("Established mysql connection");

    if (createDatabase) {
        debug("Database creations initialization")
        await createDatabaseIfNoneExisiting(mysqlConfig.database);
    }
    await useDatabase(database);
    debug("Connected to database")

    debug("Initialization setup database");
    //TODO move guard logic into creation script
    if (dbSchema && fs.existsSync(resolve(cwd(), dbSchema))) {
        await importCreationScript(mysqlConfig, dbSchema);
        debug("Imported initialization script");
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
    if(Object.keys(setupHooks).length > 0) {
        for (let action in setupHooks) {
            if (setupHooks[action] instanceof Promise) {
                await setupHooks[action]();
                continue;
            }
            await new Promise(resolve => {
                setupHooks[action](() => {
                    resolve();
                });
            });
        }
        debug("Imported setup hooks");
        return;
    }
    debug("No setup hooks provided");
}
