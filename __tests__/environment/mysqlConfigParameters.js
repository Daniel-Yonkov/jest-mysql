const exec = require("child_process").exec;
const { importCreationScript } = require("../../databaseSetup");
jest.mock("child_process");

let execMethod;
beforeAll(async () => {
    exec.mockImplementation((commandString, config, callback) => {
        const error = new Error("exec error");
        const stdout = null;
        const stderr = "stderr";
        callback(error, stdout, stderr);

        execMethod = jest.fn();
        execMethod(commandString);
    });
});


it("Check DB config using Host & User only ", async () => {
    const dummyMysqlConfig = {
        host: "127.0.0.1",
        user: "root",
    };
    const dummyPathToCreationScript = "FILE";
    await expect(
        importCreationScript(dummyMysqlConfig, dummyPathToCreationScript)
    ).rejects.toBe("stderr");
    expect(execMethod).toHaveBeenCalledWith('mysql -h 127.0.0.1 -u root  < FILE');
});

it("Check DB config using Port ", async () => {
    const dummyMysqlConfig = {
        host: "127.0.0.1",
        port: 3306,
        user: "root",
    };
    const dummyPathToCreationScript = "FILE2";
    await expect(
        importCreationScript(dummyMysqlConfig, dummyPathToCreationScript)
    ).rejects.toBe("stderr");
    expect(execMethod).toHaveBeenCalledWith('mysql -h 127.0.0.1 -u root -P 3306  < FILE2');
});


it("Check DB config using password ", async () => {
    const dummyMysqlConfig = {
        host: "127.0.0.1",
        user: "root",
        password: "superSecret",
    };
    const dummyPathToCreationScript = "FILE";
    await expect(
        importCreationScript(dummyMysqlConfig, dummyPathToCreationScript)
    ).rejects.toBe("stderr");
    expect(execMethod).toHaveBeenCalledWith('mysql -h 127.0.0.1 -u root -psuperSecret  < FILE');
});


it("Check DB config using database parameter ", async () => {
    const dummyMysqlConfig = {
        host: "127.0.0.1",
        user: "root",
        database: "jest_mysql_test",
    };
    const dummyPathToCreationScript = "FILE";
    await expect(
        importCreationScript(dummyMysqlConfig, dummyPathToCreationScript)
    ).rejects.toBe("stderr");
    expect(execMethod).toHaveBeenCalledWith('mysql -h 127.0.0.1 -u root jest_mysql_test < FILE');
});


it("Check seven part config ", async () => {
    const dummyMysqlConfig = {
        host: "127.0.0.1",
        port: 3306,
        user: "root",
        password: "root",
        database: "jest_mysql_test"
    };
    const dummyPathToCreationScript = "FILE";
    await expect(
        importCreationScript(dummyMysqlConfig, dummyPathToCreationScript)
    ).rejects.toBe("stderr");
    expect(execMethod).toHaveBeenCalledWith('mysql -h 127.0.0.1 -u root -proot -P 3306 jest_mysql_test < FILE');
});
