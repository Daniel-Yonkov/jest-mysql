const exec = require("child_process").exec;
const cwd = require("cwd");
const debug = require("debug")("jest-mysql:database-setup");
async function createDatabaseIfNoneExisiting(databaseName) {
    debug("Checking database exists")
    const databaseExist = await searchForDatabase(databaseName);

    if (databaseExist === false) {
        debug("Creating database")
        await createTestingDatabase(databaseName);
        debug("Databasea created");
        return;
    }
    debug("Database exists, omiting creation");
}
//TODO rework using asing query helper
function searchForDatabase(databaseName) {
    return new Promise((resolve, reject) => {
        global.db.query(
            `SHOW DATABASES LIKE "${databaseName}";`,
            (showError, showResults) => {
                if (showError) {
                    return reject(showError);
                }
                resolve(showResults.length > 0);
            }
        );
    });
}
//TODO rework using asing query helper
function createTestingDatabase(databaseName) {
    return new Promise((resolve, reject) => {
        global.db.query(
            `CREATE DATABASE ${databaseName} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`,
            (creationError, creationResult) => {
                if (creationError) {
                    return reject(creationError);
                }
                resolve(creationResult);
            }
        );
    });
}
//TODO rework using asing query helper
function useDatabase(databaseName) {
    return new Promise((resolve, reject) => {
        global.db.query(`USE ${databaseName};`, (useError, useResult) => {
            if (useError) {
                return reject("Unable to connect to database");
            }
            resolve(useResult);
        });
    });
}
//TODO rework using asing query helper
function importCreationScript(mysqlConfig, creationScriptPath = "") {
    return new Promise((resolve, reject) => {
        //mysql login information
        let params = ["mysql", "-h", mysqlConfig.host, "-u", mysqlConfig.user];
        if ("password" in mysqlConfig && mysqlConfig.password.length > 0) {
            params.push(`-p${mysqlConfig.password}`);
        }
        //we choose the database
        params.push(mysqlConfig.database);
        if (creationScriptPath) {
            params.push(`< ${creationScriptPath}`);

            exec(params.join(" "), { cwd: cwd() }, (error, stdout, stderr) => {
                if (error) {
                    return reject(stderr);
                }
                resolve();
            });
            return;
        }
        resolve();
    });
}

module.exports = {
    createDatabaseIfNoneExisiting,
    importCreationScript,
    useDatabase
};
