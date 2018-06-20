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
		Products: []
	};
	
	pub.getQueryJSON(res, "CALL 列示購物車內庫存不足產品(" + cartId + ");", true, optObj, setProducts);
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