var express = require('express');
var router = express.Router();
var pool = require('./lib/db.js');
var pub = require('./lib/public.js');

var cartName, customerName, customerPhone, contactPerson, contactPhone, sales;

router.post('/', function(req, res, next) {
	var reqObj = JSON.parse(JSON.stringify(req.body));
	cartName = reqObj.CartName;
	customerName = reqObj.CustomerName;
	customerPhone = reqObj.CustomerPhone;
	contactPerson = reqObj.ContactPerson;
	contactPhone = reqObj.ContactPhone;
	sales = reqObj.Sales;
	
	var optObj = {
		Status: false,
		Success: false,
		CartInfo: {
			Id: 0,
			Name: ""
		}
	};
	
	try {
		if (
			cartName.length > 30 ||
			customerName.length > 50 ||
			customerPhone.length > 15 ||
			contactPerson.length > 30 ||
			contactPhone.length > 15 ||
			sales.length > 15
		   )  {
			pub.sendBadResponse(res, optObj);
			return;
		   }
	}catch (e) {
		pub.sendBadResponse(res, optObj);
		return;
	}

	var mandate = "CALL 新增購物車('" + cartName + "', '" + customerName + "', '" + customerPhone + "', '" 
			+ contactPerson + "', '" + contactPhone + "', '" + sales + "');";
	pub.getQueryJSON(res, mandate, false, optObj, setCartInfo);
});

function setCartInfo(res, result, optObj) {
	if (!pub.isJSONEmpty(result)) {
		optObj.Success = true;
		optObj.CartInfo = result;
	}else {
		optObj.Success = false;
		delete optObj.CartInfo;
	}
	
	pub.sendJSONResponse(res, optObj)
}

module.exports = router;