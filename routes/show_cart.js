var express = require('express');
var router = express.Router();
var pool = require('./lib/db.js');
var pub = require('./lib/public.js');

var cartId;

router.post('/', function(req, res, next) {
	var reqObj = JSON.parse(JSON.stringify(req.body));
	cartId = reqObj.CartId;
	
	var optObj = {
		Status: false,
		Success: false,
		CartInfo: {},
		Products: []
	};
	
	try {
		if (
			cartId > 16777215
		   ) {
			pub.sendBadResponse(res, optObj);
			return;
		   }
	}catch (e) {
		pub.sendBadResponse(res, optObj);
		return;
	}

	var mandate = "CALL 顯示購物車摘要(" + cartId + ");"
	pub.getQueryJSON(res, mandate, false, optObj, setCartInfo);
});

function setCartInfo(res, result, optObj) {
	if (result != undefined && !pub.isJSONEmpty(result)) {
		optObj.CartInfo = result;
		
		var mandate = "CALL 顯示購物車明細(" + cartId + ");"
		pub.getQueryJSON(res, mandate, true, optObj, setProducts);
	}else {
		optObj.Success = false;
		delete optObj.CartInfo;
		delete optObj.Products;
		
		pub.sendJSONResponse(res, optObj);		
	}
}

function setProducts(res, result, optObj) {
	if (result.length > 0) {
		optObj.Success = true;
		optObj.Products = result;
	}else {
		optObj.Success = false;
		delete optObj.Products;
	}
	pub.sendJSONResponse(res, optObj)
}

module.exports = router;