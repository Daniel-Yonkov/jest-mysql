const util = require("util");
const { resolve } = require("path");``
const debug = require("debug")("jest-mysql:hooksLoadout");
const cwd = require("cwd");

async function loadSetupHooks() {
    debug("Checking for user defined setup hooks...");
    try {
        const setupHooks = require(resolve(cwd(), "setupHooks"));
        if (Object.keys(setupHooks).length > 0) {
            for (let action in setupHooks) {
                if (!util.types.isAsyncFunction(setupHooks[action])) {
                    throw new Error(
                        "Setup hook fuction must be Async/Promise based"
                    );
                }
                await setupHooks[action]();
            }
            debug("Imported setup hooks");
            return;
        }
        debug("No setup hooks provided");
    } catch {
        debug("Unable to load setup hooks");
    }
}

module.exports = {
    loadSetupHooks
};
