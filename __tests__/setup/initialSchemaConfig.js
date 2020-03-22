const mysql = require("mysql");
const { resolve } = require("path");
const { writeConfig } = require("../../tests/fixtures/configWriter");
const { query } = require("../../helpers/mysql");
let globalSetup;
let databaseOptions = {};

//Tests the creation of database strucutre based on predefined SQL dump.

beforeAll(async () => {
    await writeConfig(
        resolve(__dirname, "../../tests/configs/providedSchema.js")
    );
    globalSetup = require("../../setup");
});

it("Should have two tables created", async () => {
    await globalSetup();
    const { results } = await query("SHOW TABLES");

    tables = [];
    for (let [databaseKey, tableName] of Object.entries(results[0])) {
        tables.push(tableName);
    }
    expect(tables).toHaveLength(1);
    expect(tables[0]).toBe("user");
});

afterAll(() => {
    global.db.destroy();
});
