const mysql = require("mysql");
const { query } = require("../../helpers/mysql");

jest.mock("mysql");

it("Should throw error if mysql query returns an error", async () => {
    global.db = mysql;
    global.db.query = jest.fn().mockImplementation((query, callback) => {
        // lets mock a mysql return error
        const error = new Error("mysql error");
        const results = [];
        const fields = ["some", "fields"];
        callback(error, results, fields);
    });
    await expect(query("Select 1")).rejects.toThrow("mysql error");
});