var express = require('express');
var router = express.Router();
var pool = require('./lib/db.js');
var pub = require('./lib/public.js');

router.post('/', function(req, res, next) {
	var reqObj = JSON.parse(JSON.stringify(req.body));
	var cartId = reqObj.CartId;
	var productId = reqObj.ProductId;
	var amount = reqObj.Amount;
	
	var optObj = {
		Status: false,
		Success: false
	};
	
	try {
		if (
			cartId > 16777215 ||
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

	var mandate = "CALL 異動購物車項目('" + cartId + "', '" + productId + "', '" + amount + "');";
	pub.getQueryJSON(res, mandate, false, optObj, setResponse);
});

function setResponse(res, result, optObj) {
	if (result != undefined) {
		optObj.Success = true;
	}else {
		optObj.Success = false;
	}
	
	pub.sendJSONResponse(res, optObj)
}

module.exports = router;