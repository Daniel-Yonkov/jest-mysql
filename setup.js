const fs = require("fs");
const { resolve, join } = require("path");
const mysql = require("mysql");
const cwd = require("cwd");
const debug = require("debug")("jest-mysql:setup");
const {
    createDatabaseIfNoneExisiting,
    importCreationScript,
    useDatabase
} = require("./databaseSetup");
const defaultOptions = require("./default-config");
const { loadSetupHooks } = require("./hooksLoadout");

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

    if (dbSchema) {
        if (!fs.existsSync(resolve(cwd(), dbSchema))) {
            throw new Error(`Unable to find schema location. please check path: \n
                ${resolve(cwd(), dbSchema)}`);
        }
        await importCreationScript(mysqlConfig, dbSchema);
    }
    debug("Imported database schema");
    await loadSetupHooks();
};

//TODO import default supported options and override with the user provided
function getTestingMysqlDatabaseOptions() {
    try {
        const databaseOptions = require(resolve(cwd(), "jest-mysql-config.js"));
        return databaseOptions;
    } catch {
        throw new Error("Unable to find and import testing database config");
    }
}
