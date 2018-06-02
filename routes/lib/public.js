var pool = require('./db.js');

exports.getQueryJSON = function getQueryJSON (res, mandate, convertToArray, optObj, cb) {
	pool.query(mandate, function (error, results, fields) {
		//console.log(results);
	
        if (error) {
			console.log(error);
			console.log("確認MySQL已開啟、Postman有Header");
			sendFailResponse (res, optObj);
			//res.status(500).send(err.message);
        }else {
			if (convertToArray) { //傳回陣列
				if (results[0].length > 0)
					cb(res, results[0], optObj);
				else
					cb(res, [], optObj);
				
			}else { //傳回物件
				if (results[0] != null)
					cb(res, results[0][0], optObj);
				else
					cb(res, {}, optObj);
			}
        }
		//pool.end();
    });
}

exports.executeSQL = function executeSQL (mandate) {
	pool.query(mandate, function (error, results, fields) {
		if (error) {
			console.log(error);
			console.log("確認MySQL已開啟、Postman有Header");
			sendFailResponse (res, optObj);
			//res.status(500).send(err.message);
        }
	});
}

exports.isJSONEmpty = function isJSONEmpty (object) {
	if (object != undefined)
		return Object.getOwnPropertyNames(object).length == 0;
	else
		return true;
}

exports.getFileExtension = function (file) {
	var extension;	
	var filename = (file.originalname).split("."); //手機選圖片好像會只有副檔名
	if (filename.length < 2)
		extension = "jpg";
	else
		extension = filename[filename.length - 1];
	
	return "." + extension;
}

exports.getUploadedFilename = function (path) {
	var filename = path.split("\\");
	return filename[filename.length - 1];	
}

exports.sendJSONResponse = function (res, optObj) {
	optObj.Status = true;
	res.status(200).json(optObj);
}

function sendFailResponse (res, optObj) {
	optObj = {
		Status: false
	};
	res.status(200).json(optObj);
}
