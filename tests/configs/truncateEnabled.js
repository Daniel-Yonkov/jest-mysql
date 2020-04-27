module.exports = {
    databaseOptions: {
        host: "127.0.0.1",
        user: "root",
        password: "root",
        database: "jest_mysql_test",
        socketPath: "",
        dateStrings: "DATETIME"
    },
    createDatabase: true,
    dbSchema: "tests/configs/DB_creation.sql",
    truncateDatabase: true,
};
