const exec = require("child_process").exec;
const { importCreationScript } = require("../../databaseSetup");
jest.mock("child_process");

it("Should fail to createa database due to fail in exec", async () => {
    exec.mockImplementation((commandString, config, callback) => {
        const error = new Error("exec error");
        const stdout = null;
        const stderr = "stderr";
        callback(error, stdout, stderr);
    });
    const dummyMysqlConfig = {};
    const dummyPathToCreationScript = "";
    await expect(
        importCreationScript(dummyMysqlConfig, dummyPathToCreationScript)
    ).rejects.toBe("stderr");
});
