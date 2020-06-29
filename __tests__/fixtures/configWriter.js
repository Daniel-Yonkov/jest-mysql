const fs = require("fs");
const {
    writeConfig,
    removeConfig
} = require("../../tests/fixtures/configWriter");

jest.mock("fs");

fs.promises = {
    copyFile: jest.fn().mockImplementation(() => {
        Promise.rejects("Copy file error");
    }),
    unlink: jest.fn().mockImplementation(() => {
        Promise.rejects("Remove file error");
    })
};

it("Should throw error if copy config file fails", async () => {
    await expect(writeConfig("./some/non/existing/file.js")).rejects.toThrow(
        "Unable to copy config file"
    );
});

it("Should not throw if file to be removed does not exist", async () => {
    const result = await removeConfig("./some/non/existing/file.js");
     expect(result).toBeUndefined();
});
