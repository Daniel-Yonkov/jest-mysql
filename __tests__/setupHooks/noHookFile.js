let debug = require("debug");
const { resolve } = require("path");
const { loadSetupHooks } = require("../../hooksLoadout");
const {
    removeConfig,
    writeConfig
} = require("../../tests/fixtures/configWriter");

jest.mock("debug", () => {
    let originalModule = jest.requireActual("debug");
    originalModule.log = jest.fn();
    return originalModule;
});

debug.enable("jest-mysql:hooksLoadout");
const filePath = resolve(__dirname, "../../setupHooks.js");

beforeAll(async () => {
    await removeConfig(filePath);
});

it("Should have no available hooks as file is missing", async () => {
    debug.enable("jest-mysql:hooksLoadout");

    await loadSetupHooks();

    expect(debug.log.mock.calls[1][0]).toMatch(/Unable to load setup hooks/);
});

afterAll(async () => {
    await writeConfig(
        resolve(__dirname, "../../tests/configs/setupHooks.js"),
        "setupHooks.js"
    );
});
