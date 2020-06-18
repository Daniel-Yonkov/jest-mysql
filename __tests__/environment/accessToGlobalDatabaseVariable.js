const mysql = require("mysql");
const Environment = require("../../environment");
const { writeObjectConfig } = require("../../tests/fixtures/configWriter");

jest.mock("mysql");

let env, connectMethod, endMethod;

beforeAll(async () => {
    //create global config file, simulating setup run
    const globalConfig = require("../../tests/configs/default.js");
    await writeObjectConfig(globalConfig);
    jest.resetModules();

    mysql.createConnection.mockImplementation(() => {
        connectMethod = jest.fn();
        endMethod = jest.fn().mockImplementation(callback => {
            callback();
        });

        return {
            connect: connectMethod,
            end: endMethod
        };
    });
    env = new Environment({});
});

it("Should create global variable with the database connection", async () => {
    await env.setup();

    expect(mysql.createConnection).toHaveBeenCalledTimes(1);
    expect(connectMethod).toHaveBeenCalledTimes(1);
});

it("Should destroy global database connection upon teardown", async () => {
    await env.teardown();

    expect(endMethod).toHaveBeenCalledTimes(1);
});
