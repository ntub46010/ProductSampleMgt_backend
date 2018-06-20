var express = require('express');
var router = express.Router();
var pool = require('./lib/db.js');
var pub = require('./lib/public.js');

var userId;

router.post('/', function(req, res, next) {
	var reqObj = JSON.parse(JSON.stringify(req.body));
	userId = reqObj.UserId;
	
	var optObj = {
		Status: false,
		Success: false,
		Profile: {}
	};
	
	var mandate = "CALL 顯示使用者資料 ('" + userId + "');";
	pub.getQueryJSON(res, mandate, false, optObj, setProfile);
});

function setProfile(res, result, optObj) {
	if (!pub.isJSONEmpty(result)) {	
		optObj.Success = true;
		
		optObj.Profile = result;		
	}else {
		optObj.Success = false;
		
		delete optObj.Profile;		
	}
	pub.sendJSONResponse(res, optObj);
}

module.exports = router;