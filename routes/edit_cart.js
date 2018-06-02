var express = require('express');
var router = express.Router();
var pool = require('./lib/db.js');
var pub = require('./lib/public.js');

var cartId, cartName, customerName, customerPhone, contactPerson, contactPhone;

router.post('/', function(req, res, next) {
	var reqObj = JSON.parse(JSON.stringify(req.body));
	cartId = reqObj.CartId;
	cartName = reqObj.CartName;
	customerName = reqObj.CustomerName;
	customerPhone = reqObj.CustomerPhone;
	contactPerson = reqObj.ContactPerson;
	contactPhone = reqObj.ContactPhone;
	
	var optObj = {
		Status: false,
		Success: false
	};

	var mandate = "CALL 編輯購物車('" + cartId + "', '" + cartName + "', '" + customerName + "', '" + customerPhone + "', '" 
			+ contactPerson + "', '" + contactPhone + "');";
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