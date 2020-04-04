const teardown = require("../../teardown");
const { resolve } = require("path");
const { writeConfig } = require("../../tests/fixtures/configWriter");

//Tests the teardown method with default configuration

beforeAll(async () => {
    await writeConfig(
        resolve(__dirname, "../../tests/configs/default.js"),
        "globalConfig.json"
    );
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
