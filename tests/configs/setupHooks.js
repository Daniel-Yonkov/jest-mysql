async function postSetup() {
    await mockAsyncFunction();
}

function mockAsyncFunction() {
    return Promise.resolve();
}
module.exports = {
    postSetup
};
