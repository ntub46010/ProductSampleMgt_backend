var express = require('express');
var router = express.Router();
var pool = require('./lib/db.js');
var pub = require('./lib/public.js');

router.post('/', function(req, res, next) {
	var optObj = {
		Status: false,
		Success: false,
		Materials: [],
		Colors: []
	};
	
	pub.getQueryJSON(res, "CALL 顯示材質();", true, optObj, setMaterial);
});

function setMaterial(res, result, optObj) {
	optObj.Materials = result;
	pub.getQueryJSON(res, "CALL 顯示顏色();", true, optObj, setColor);
}

function setColor(res, result, optObj) {
	optObj.Colors = result;
	
	if (optObj.Materials.length == 0 && optObj.Colors.length == 0) {
		optObj.Success = false;
		delete optObj.Materials;
		delete optObj.Colors;
	}else {
		optObj.Success = true;
	}
	
	pub.sendJSONResponse(res, optObj)
}

module.exports = router;