var express = require('express');
var router = express.Router();
var pool = require('./lib/db.js');
var pub = require('./lib/public.js');

router.post('/', function(req, res, next) {
	var reqObj = JSON.parse(JSON.stringify(req.body));
	var condition = reqObj.Condition;
	
	var optObj = {
		Status: false,
		Success: false,
		Orders: []
	};
	
	try {
		if (
			condition > 255
		   ) {
			pub.sendBadResponse(res, optObj);
			return;
		   }
	}catch (e) {
		pub.sendBadResponse(res, optObj);
		return;
	}
	
	var mandate = "CALL 列示訂單(" + condition + ");";
	pub.getQueryJSON(res, mandate, true, optObj, setOrders);
});

function setOrders(res, result, optObj) {
	if (result.length > 0) {
		optObj.Success = true;
		optObj.Orders = result;
	}else {
		optObj.Success = false;
		delete optObj.Orders;
	}
	
	pub.sendJSONResponse(res, optObj)
}

module.exports = router;