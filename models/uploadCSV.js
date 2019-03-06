module.exports = function uploadCSV(client) {
    const csv = require('csvtojson/v2');
    const path = require('path');
    const db = client.db('test');
    const file_list = ['menu', 'blog'];
    file_list.forEach(function (filename) {
        csv({
            ignoreEmpty: true,
            checkType: true
        }).fromFile(path.join(__dirname, filename + '.csv')).then((json_data) => {
            db.collection(filename, function (err, collection) {
                if (err !== null) console.log(err);
                collection.findOne({}, function (err, data) {
                    if (err !== null) console.log(err);
                    if (data === null) {
                        console.log(json_data);
                        collection.insertMany(json_data).then(() => {
                            console.log(filename + ' is uploaded');
                        });
                    }
                });
            })
        });
    });
};
