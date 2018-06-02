var express = require('express');
var router = express.Router();
var pool = require('./lib/db.js');
var pub = require('./lib/public.js');

var onSale;

router.post('/', function(req, res, next) {
	var reqObj = JSON.parse(JSON.stringify(req.body));
	onSale = reqObj.OnSale;
	
	var optObj = {
		Status: false,
		Success: false,
		Products: []
	};
	
	pub.getQueryJSON(res, "CALL 列示產品(" + onSale + ");", true, optObj, setProducts);
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