function query(string) {
    return new Promise((resolve, reject) => {
        global.db.query(string, (error, results, fields) => {
            if (error) {
                reject(error);
            }
            resolve({ results, fields });
            return;
        });
    });
}

module.exports = {
    query
};
