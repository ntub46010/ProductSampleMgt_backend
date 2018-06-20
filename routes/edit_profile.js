var express = require('express');
var router = express.Router();
var pool = require('./lib/db.js');
var pub = require('./lib/public.js');

var userId, name, customerName, pwd, phone, email;

router.post('/', function(req, res, next) {
	var reqObj = JSON.parse(JSON.stringify(req.body));
	userId = reqObj.UserId;
	name = reqObj.Name;
	pwd = reqObj.Password;
	phone = reqObj.Phone;
	email = reqObj.Email;
	
	var optObj = {
		Status: false,
		Success: false
	};

	var mandate = "CALL 編輯個人檔案('" + userId + "', '" + name + "', '" + pwd + "', '" + phone + "', '" 
			+ email + "');";
	pub.getQueryJSON(res, mandate, false, optObj, sendResponse);
});

function sendResponse(res, result, optObj) {
	if (result != undefined) {
		optObj.Success = true;
	}else {
		optObj.Success = false;
	}
	
	pub.sendJSONResponse(res, optObj)
}

module.exports = router;