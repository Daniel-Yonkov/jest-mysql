const util = require("util");
const { resolve } = require("path");
const debug = require("debug")("jest-mysql:hooksLoadout");
const cwd = require("cwd");

async function loadSetupHooks() {
    debug("Checking for user defined setup hooks...");
    try {
        const setupHooks = require(resolve(cwd(), "setupHooks"));
        if (Object.keys(setupHooks).length <= 0) {
            debug("No setup hooks provided");
            return;
        }
        await loadHooks(setupHooks);
        debug("Imported setup hooks");
    } catch {
        debug("Unable to load setup hooks");
    }
}

async function loadHooks(hooks) {
    for (let action in hooks) {
        if (!util.types.isAsyncFunction(hooks[action])) {
            throw new Error(
                `Hook '${action}' must be Async/Promise based function`
            );
        }
        await hooks[action]();
    }
}

module.exports = {
    loadSetupHooks
};
