const { loadSetupHooks } = require("../../../hooksLoadout");
let debug = require("debug");

jest.mock("debug", () => {
    let originalModule = jest.requireActual("debug");
    originalModule.log = jest.fn();
    return originalModule;
});

debug.enable("jest-mysql:hooksLoadout");

it("Should have no available hooks as file is missing", async () => {
    debug.enable("jest-mysql:hooksLoadout");

    await loadSetupHooks();

    expect(debug.log.mock.calls[1][0]).toMatch(/Unable to load setup hooks/);
});