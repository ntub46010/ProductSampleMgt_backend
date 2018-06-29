var express = require('express');
var router = express.Router();
var pool = require('./lib/db.js');
var pub = require('./lib/public.js');

router.post('/', function(req, res, next) {
	var reqObj = JSON.parse(JSON.stringify(req.body));
	var orderId = reqObj.OrderId;
	var productId = reqObj.ProductId;
	var amount = reqObj.Amount;
	
	var optObj = {
		Status: false,
		Success: false,
		IsLower: false
	};
	
	try {
		if (
			orderId > 16777215 ||
			productId > 65535 ||
			amount > 16777215
		   ) {
			pub.sendBadResponse(res, optObj);
			return;
		   }
	}catch (e) {
		pub.sendBadResponse(res, optObj);
		return;
	}

	var mandate = "CALL 異動訂單項目('" + orderId + "', '" + productId + "', '" + amount + "');";
	pub.getQueryJSON(res, mandate, false, optObj, setIsLower);
});

function setIsLower(res, result, optObj) {
	if (!pub.isJSONEmpty(result)) {
		optObj.Success = true;
		optObj.IsLower = result.Stock < result.SafeStock;
	}else {
		optObj.Success = false;
		delete optObj.IsLower;
	}
	
	pub.sendJSONResponse(res, optObj)
}

module.exports = router;