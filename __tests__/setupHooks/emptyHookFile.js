const fs = require("fs");
const { resolve } = require("path");
let debug = require("debug");
const { loadSetupHooks } = require("../../hooksLoadout");
const { writeConfig } = require("../../tests/fixtures/configWriter");

jest.mock("debug", () => {
    let originalModule = jest.requireActual("debug");
    originalModule.log = jest.fn();
    return originalModule;
});

const filePath = resolve(__dirname, "../../setupHooks.js");
debug.enable("jest-mysql:hooksLoadout");

beforeAll(async () => {
    await writeEmptyFileExport(filePath);
    jest.resetModules();
});

it("Should not to load hooks if provided with empty object", async () => {
    await loadSetupHooks();

    expect(debug.log.mock.calls[1][0]).toMatch(/No setup hooks provided/);
});

// restores the default setupHooks
afterAll(async () => {
    await writeConfig(
        resolve(__dirname, "../../tests/configs/setupHooks.js"),
        "setupHooks.js"
    );
});

async function writeEmptyFileExport(filePath) {
    const file = "module.exports = {};";
    await fs.promises.writeFile(filePath, file);
}
