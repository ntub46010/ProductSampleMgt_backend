var express = require('express');
var router = express.Router();
var pool = require('./lib/db.js');
var pub = require('./lib/public.js');

var cartId, cartName, customerName, customerPhone, contactPerson, contactPhone;

router.post('/', function(req, res, next) {
	var reqObj = JSON.parse(JSON.stringify(req.body));
	var cartId = reqObj.CartId;
	var cartName = reqObj.CartName;
	var customerName = reqObj.CustomerName;
	var customerPhone = reqObj.CustomerPhone;
	var contactPerson = reqObj.ContactPerson;
	var contactPhone = reqObj.ContactPhone;
	
	var optObj = {
		Status: false,
		Success: false
	};
	
	try {
		if (
			cartId > 16777215 ||
			cartName.length > 30 ||
			customerName.length > 50 ||
			customerPhone.length > 15 ||
			contactPerson.length > 30 ||
			contactPhone.length > 15 ||
			sales.length > 15
		   ) {
			pub.sendBadResponse(res, optObj);
			return;
		   }
	}catch (e) {
		pub.sendBadResponse(res, optObj);
		return;
	}

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