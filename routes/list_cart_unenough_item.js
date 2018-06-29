var express = require('express');
var router = express.Router();
var pool = require('./lib/db.js');
var pub = require('./lib/public.js');

router.post('/', function(req, res, next) {
	var reqObj = JSON.parse(JSON.stringify(req.body));
	var cartId = reqObj.CartId;
	
	var optObj = {
		Status: false,
		Success: false,
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
	
	var mandate = "CALL 列示購物車內庫存不足產品(" + cartId + ");";
	pub.getQueryJSON(res, mandate, true, optObj, setProducts);
});

function setProducts(res, result, optObj) {
	if (result.length > 0) {
		optObj.Success = false; //此處注意Success相反
		delete optObj.Products;
		optObj.Products = result;
	}else {
		optObj.Success = true;
	}
	
	pub.sendJSONResponse(res, optObj)
}

module.exports = router;