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

afterEach(() => {
    debug.log.mockClear();
});

it("Should load setup hooks", async () => {
    await loadSetupHooks();
    expect(debug.log.mock.calls[1][0]).toMatch(/Imported setup hooks/);
});

it("Should fail to load not async/promise based methods", async () => {
    jest.doMock("../../setupHooks", () => {
        return {
            postSetup: () => {}
        };
    });

    await loadSetupHooks();

    expect(debug.log.mock.calls[1][0]).toMatch(/Unable to load setup hooks/);

    //restore origianl config implementation
    jest.mock("../../setupHooks", () => {
        let setupHooks = jest.requireActual("../../setupHooks");
        return setupHooks;
    });
});
