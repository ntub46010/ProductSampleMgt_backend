var express = require('express');
var router = express.Router();
var pool = require('./lib/db.js');
var pub = require('./lib/public.js');

var cartId, productId, amount;

router.post('/', function(req, res, next) {
	var reqObj = JSON.parse(JSON.stringify(req.body));
	cartId = reqObj.CartId;
	productId = reqObj.ProductId;
	amount = reqObj.Amount;
	
	var optObj = {
		Status: false,
		Success: false
	};

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