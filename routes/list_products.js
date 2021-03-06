var express = require('express');
var router = express.Router();
var pool = require('./lib/db.js');
var pub = require('./lib/public.js');

router.post('/', function(req, res, next) {
	var reqObj = JSON.parse(JSON.stringify(req.body));
	var onSale = reqObj.OnSale;
	
	var optObj = {
		Status: false,
		Success: false,
		Products: []
	};
	
	try {
		if (
			onSale != 0 &&
			onSale != 1
		   ) {
			pub.sendBadResponse(res, optObj);
			return;
		   }
	}catch (e) {
		pub.sendBadResponse(res, optObj);
		return;
	}
	
	var mandate = "CALL 列示產品(" + onSale + ");";
	pub.getQueryJSON(res, mandate, true, optObj, setProducts);
});

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