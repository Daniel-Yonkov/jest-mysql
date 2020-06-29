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

it("Should fail due to invalid schema location on disk", async () => {
    jest.mock("../../jest-mysql-config.js", () => {
        const config = jest.requireActual("../../jest-mysql-config.js");
        return {
            ...config,
            dbSchema: "non/existing/file.location"
        };
    });
    await expect(globalSetup()).rejects.toThrow(
        /Unable to find schema location. please check path/
    );
});

afterAll(() => {
    global.db.destroy();
});
