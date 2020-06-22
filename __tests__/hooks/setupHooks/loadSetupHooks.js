const { resolve } = require("path");
let debug = require("debug");
const {
    writeConfig,
    removeConfig
} = require("../../../tests/fixtures/configWriter");

jest.mock("debug", () => {
    let originalModule = jest.requireActual("debug");
    originalModule.log = jest.fn();
    return originalModule;
});

const filePath = resolve(__dirname, "../../../setupHooks.js");
debug.enable("jest-mysql:hooksLoadout");

it("Should load setup hooks", async () => {
    await writeConfig(
        resolve(__dirname, "../../../tests/configs/setupHooks.js"),
        "setupHooks.js"
    );
    const { loadSetupHooks } = require("../../../hooksLoadout");
    await loadSetupHooks();

    expect(debug.log.mock.calls[1][0]).toMatch(/Imported setup hooks/);
});

afterAll(async () => {
    await removeConfig(filePath);
});
