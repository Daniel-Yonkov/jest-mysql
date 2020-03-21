function query(string) {
    return new Promise(resolve => {
        global.db.query(string, (error, results, fields) => {
            resolve({ error, results, fields });
        });
    });
}

module.exports = {
    query
};
