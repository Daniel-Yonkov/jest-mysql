const { resolve } = require("path");
let debug = require("debug");
const { writeConfig } = require("../../tests/fixtures/configWriter");
const { loadSetupHooks } = require("../../hooksLoadout");

jest.mock("debug", () => {
    let originalModule = jest.requireActual("debug");
    originalModule.log = jest.fn();
    return originalModule;
});

debug.enable("jest-mysql:hooksLoadout");

beforeAll(async () => {
    await writeConfig(
        resolve(__dirname, "../../tests/configs/setupHooks.js"),
        "setupHooks.js"
    );
});

it("Should load setup hooks", async () => {
    await loadSetupHooks();
    expect(debug.log.mock.calls[1][0]).toMatch(/Imported setup hooks/);
});
