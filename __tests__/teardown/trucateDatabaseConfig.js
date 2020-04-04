const mysql = require("mysql");
const { resolve } = require("path");
const { writeConfig } = require("../../tests/fixtures/configWriter");
const { query } = require("../../helpers/mysql");
let globalTeardown, databaseOptions;
//Tests the database truncation after end of test suite runs

beforeAll(async () => {
    await writeConfig(
        resolve(__dirname, "../../tests/configs/truncateEnabled.js")
    );

    const {
        databaseOptions: currentOptions
    } = require("../../jest-mysql-config");
    databaseOptions = currentOptions;

    const globalSetup = require("../../setup");
    await globalSetup();

    globalTeardown = require("../../teardown");
});

it("Should trigger error if database does not exists", async () => {
    const { results: preTeardownResults } = await query(
        `SELECT count(id) AS userCount FROM user`
    );
    expect(preTeardownResults[0]["userCount"]).toBe(2);

    //Teardown the presets
    await globalTeardown();

    //reconnect to the database as the connection has been destroyed by the teardown
    global.db = mysql.createConnection(databaseOptions);

    const { results: postTeardownResults } = await query(
        `SELECT count(id) AS userCount FROM user`
    );
    expect(postTeardownResults[0]["userCount"]).toBe(0);
});

afterAll(() => {
    global.db.destroy();
});
