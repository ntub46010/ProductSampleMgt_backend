var express = require('express');
var router = express.Router();
var pool = require('./lib/db.js');
var pub = require('./lib/public.js');

router.post('/', function(req, res, next) {
	var reqObj = JSON.parse(JSON.stringify(req.body));
	var customerId = reqObj.Id;
	
	var optObj = {
		Status: false,
		Success: false,
		Contacts: []
	};
	
	try {
		if (
			customerId > 65535
		   ) {
			pub.sendBadResponse(res, optObj);
			return;
		   }
	}catch (e) {
		pub.sendBadResponse(res, optObj);
		return;
	}
	
	var mandate = "CALL 顯示客戶聯絡人(" + customerId + ");";
	pub.getQueryJSON(res, mandate, true, optObj, setContacts);
});

function setContacts(res, result, optObj) {
	if (result.length > 0) {
		optObj.Contacts = result;
		optObj.Success = true;
	}else {
		delete optObj.Contacts;
		optObj.Success = false;
	}	
	
	pub.sendJSONResponse(res, optObj)
}

module.exports = router;