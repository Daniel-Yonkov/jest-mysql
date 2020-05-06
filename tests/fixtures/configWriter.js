const fs = require("fs");
const { resolve } = require("path");

async function writeConfig(file, filename = "jest-mysql-config.js") {
    const configFileBuffer = await fs.promises.readFile(file);
    await fs.promises.writeFile(
        resolve(__dirname, `../../${filename}`),
        configFileBuffer
    );
}


module.exports = {
    writeConfig,
};
