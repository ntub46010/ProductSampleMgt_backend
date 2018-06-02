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