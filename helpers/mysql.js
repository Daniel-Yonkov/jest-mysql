function query(string) {
    return new Promise(resolve => {
        global.db.query(string, (error, results, fields) => {
            if (error) {
                throw error;
            }
            resolve({ results, fields });
        });
    });
}

module.exports = {
    query
};
