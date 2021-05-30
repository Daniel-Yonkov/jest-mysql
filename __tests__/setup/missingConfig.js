const { removeConfig } = require("../../tests/fixtures/configWriter");

it("Should fail if no config file is provided", async () => {
    jest.resetModules();
    const globalSetup = require("../../setup");

    //removes the current config
    await removeConfig("jest-mysql-config.js");

    await expect(globalSetup()).rejects.toThrow(
        "Unable to find and import testing database config"
    );
});
