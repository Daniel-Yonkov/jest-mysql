const mysql = require("mysql");
const { resolve } = require("path");
const { writeConfig } = require("../../tests/fixtures/configWriter");
const { query } = require("../../helpers/mysql");
let globalSetup;
let databaseOptions = {};

//Tests the creation of database if none exists.

beforeAll(async () => {
    await writeConfig(
        resolve(__dirname, "../../tests/configs/createDatabaseEnabled.js")
    );
    const {
        databaseOptions: databaseOptionsFromConfig
    } = require("../../jest-mysql-config");
    databaseOptions = databaseOptionsFromConfig;
    //eslint-disable-next-line
    const { database, ...options } = databaseOptions;
    global.db = mysql.createConnection(options);
    globalSetup = require("../../setup");
});

it("Should create database if none exists", async () => {
    await query(`DROP DATABASE IF EXISTS \`${databaseOptions.database}\``);
    const { results: preSetupResults } = await query(
        `SHOW DATABASES LIKE "${databaseOptions.database}"`
    );
    expect(preSetupResults).toHaveLength(0);

    await globalSetup();

    const { results: postSetupResults } = await query(
        `SHOW DATABASES LIKE "${databaseOptions.database}"`
    );
    expect(postSetupResults).toHaveLength(1);
});

afterAll(() => {
    global.db.destroy();
});
