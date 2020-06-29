const mysql = require("mysql");
const NodeEnvironment = require("jest-environment-node");
const path = require("path");
const fs = require("fs");
const mysqlConfig = path.join(__dirname, "globalConfig.json");

const debug = require("debug")("jest-mysql:environment");

module.exports = class MysqlEnvironment extends NodeEnvironment {
    constructor(config) {
        super(config);
    }

    //we setup the environment for the tests.
    //so that each of our tests has access to global.db
    async setup() {
        debug("Setup Mysql Test Environment");

        const { databaseOptions } = JSON.parse(
            fs.readFileSync(mysqlConfig, "utf-8")
        );

        this.global.db = mysql.createConnection(databaseOptions);
        this.global.db.connect();
        debug("Global Mysql connection established!");
        await super.setup();
    }

    //we tear down the connection after finish.
    async teardown() {
        debug("Teardown Mysql Test Environment");
        await new Promise((resolve, reject) => {
            this.global.db.end(error => {
                if (error) {
                    return reject(error);
                }
                debug("Connection closed");
                resolve();
            });
        });
        await super.teardown();
    }
    
    /* istanbul ignore next */
    runScript(script) {
        return super.runScript(script);
    }
};
