const teardown = require("../../teardown");
const { writeObjectConfig } = require("../../tests/fixtures/configWriter");

//Tests the teardown method with default configuration

beforeAll(async () => {
    //create global config file, simulating setup run
    const globalConfig = require("../../tests/configs/default.js");
    await writeObjectConfig(globalConfig);
    jest.resetModules();
});

it("Should disconnect database connection", async () => {
    //mysql mocked method method
    let endMethod = jest.fn().mockImplementation(callback => {
        callback();
    });

    global.db = {
        end: endMethod
    };

    await teardown();
    expect(endMethod).toHaveBeenCalledTimes(1);
});
