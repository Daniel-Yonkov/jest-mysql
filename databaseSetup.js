const exec = require("child_process").exec;
const cwd = require("cwd");
const debug = require("debug")("jest-mysql:database-setup");
const { query } = require("./helpers/mysql");

async function createDatabaseIfNoneExisiting(databaseName) {
    debug("Checking database exists");
    const databaseExist = await searchForDatabase(databaseName);

    if (databaseExist === true) {
        debug("Database exists, omiting creation");
        return;
    }
    debug("Creating database");
    await createTestingDatabase(databaseName);
    debug("Databasea created");
}
async function searchForDatabase(databaseName) {
    const { results } = await query(`SHOW DATABASES LIKE "${databaseName}";`);
    return results.length > 0;
}
async function createTestingDatabase(databaseName) {
    const { results } = await query(
        `CREATE DATABASE ${databaseName} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
    return results;
}
async function useDatabase(databaseName) {
    const { results } = await query(`USE ${databaseName};`);
    return results;
}

function importCreationScript(mysqlConfig, creationScriptPath) {
    return new Promise((resolve, reject) => {
        //mysql login information preparation
        let params = ["mysql", "-h", mysqlConfig.host, "-u", mysqlConfig.user];
        if ("password" in mysqlConfig && mysqlConfig.password.length > 0) {
            params.push(`-p${mysqlConfig.password}`);
        }
        if ("port" in mysqlConfig ) {
            params.push(`-P ${mysqlConfig.port}`);
        }
        //sql import to database: database_name < creation_script_path
        params.push(mysqlConfig.database);
        params.push(`< ${creationScriptPath}`);

        exec(params.join(" "), { cwd: cwd() }, (error, stdout, stderr) => {
            if (error) {
                return reject(stderr);
            }
            resolve();
        });
    });
}

module.exports = {
    createDatabaseIfNoneExisiting,
    importCreationScript,
    useDatabase
};
