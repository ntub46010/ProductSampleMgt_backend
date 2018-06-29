var express = require('express');
var router = express.Router();
var pool = require('./lib/db.js');
var pub = require('./lib/public.js');

router.post('/', function(req, res, next) {
	var reqObj = JSON.parse(JSON.stringify(req.body));
	var userId = reqObj.UserId;
	var name = reqObj.Name;
	var pwd = reqObj.Password;
	var phone = reqObj.Phone;
	var email = reqObj.Email;
	
	var optObj = {
		Status: false,
		Success: false
	};

	try {
		if (
			userId.length > 15 ||
			name.length > 20 ||
			pwd.length > 32 ||
			phone.length > 15 ||
			email.length > 30 ||
			contactPhone.length > 50
		   ) {
			pub.sendBadResponse(res, optObj);
			return;
		   }
	}catch (e) {
		pub.sendBadResponse(res, optObj);
		return;
	}
	
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