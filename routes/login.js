var express = require('express');
var router = express.Router();
var pool = require('./lib/db.js');
var pub = require('./lib/public.js');

var userId, userPwd;

router.post('/', function(req, res, next) {
	var reqObj = JSON.parse(JSON.stringify(req.body));
	userId = reqObj.Account;
	userPwd = reqObj.Password;
	
	var optObj = {
		Status: false,
		Success: false,
		UserInfo: {
			Id: "",
			Name: "",
			Authority: 0,
			Identity: "",
		}
	};

	var mandate = "CALL 登入('" + userId + "', '" + userPwd + "');";
	pub.getQueryJSON(res, mandate, false, optObj, setUserInfo);
});

function setUserInfo(res, result, optObj) {
	if (!pub.isJSONEmpty(result)) {
		optObj.Success = true;
		optObj.UserInfo = result;
	}else {
		optObj.Success = false;
		delete optObj.UserInfo;
	}
	
	pub.sendJSONResponse(res, optObj)
}

module.exports = router;