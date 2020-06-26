async function postSetup() {
    await mockAsyncFunction();
}

function mockAsyncFunction() {
    return new Promise((resolve, reject) => {
        resolve();
    });
}

module.exports = {
    postSetup
};
