const teardown = require("../../teardown");

jest.mock("../../globalConfig", () => {
    const globalConfig = require("../../tests/configs/default.js");
    return globalConfig;
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

it("Should throw if fail to disconnect database connection", async () => {
    //mysql mocked method method
    let endMethod = jest.fn().mockImplementation(callback => {
        callback(new Error("Unable to close mysql connection error"));
    });

    global.db = {
        end: endMethod
    };

    await expect(teardown()).rejects.toThrow(
        "Unable to close mysql connection error"
    );
});
