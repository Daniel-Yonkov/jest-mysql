const fs = require("fs");
const { resolve } = require("path");

async function writeConfig(file, filename = "jest-mysql-config.js") {
    try {
        await fs.promises.copyFile(
            file,
            resolve(__dirname, `../../${filename}`)
        );
    } catch (e) {
        throw new Error("Unable to copy config file");
    }
}

async function writeObjectConfig(object = {}, filename = "globalConfig.json") {
    await fs.promises.writeFile(
        resolve(__dirname, `../../${filename}`),
        JSON.stringify(object)
    );
}

async function removeConfig(filePath) {
    await fs.promises.unlink(filePath);
}

module.exports = {
    writeConfig,
    writeObjectConfig,
    removeConfig
};
