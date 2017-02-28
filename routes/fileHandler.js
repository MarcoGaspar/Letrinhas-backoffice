require('colors');
var request = require('request');
var config = require('../config.js');

console.log('from fileHandler');

exports.fileDownload = function (req, res) {

    var id = req.params.id;
    var db = req.params.db;
    var photo = req.params.filename;

    request({
        'url': 'http://letrinhas.ipt.pt:85' + '/' + db + '/' + id + '/' + photo, headers: {
            "Authorization": "Basic " + new Buffer('' + ":" + '').toString("base64")
        }
    }).pipe(res);


};
