const fs = require("fs");
const { resolve } = require("path");
let debug = require("debug");
const { loadSetupHooks } = require("../../../hooksLoadout");
const { removeConfig } = require("../../../tests/fixtures/configWriter");

jest.mock("debug", () => {
    let originalModule = jest.requireActual("debug");
    originalModule.log = jest.fn();
    return originalModule;
});

const filePath = resolve(__dirname, "../../../setupHooks.js");
debug.enable("jest-mysql:hooksLoadout");

it("Should not to load hooks if provided with empty object", async () => {
    await writeEmptyFileExport(filePath);

    await loadSetupHooks();

    expect(debug.log.mock.calls[1][0]).toMatch(/No setup hooks provided/);
});

async function writeEmptyFileExport(filePath) {
    const file = "module.exports = {};";
    await fs.promises.writeFile(filePath, file);
}

async function removeEmptyFileExport(filePath) {
    await fs.promises.unlink(filePath);
}

afterAll(async () => {
    await removeConfig(filePath);
});
