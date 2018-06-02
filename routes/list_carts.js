var express = require('express');
var router = express.Router();
var pool = require('./lib/db.js');
var pub = require('./lib/public.js');

router.post('/', function(req, res, next) {	
	var optObj = {
		Status: false,
		Success: false,
		Carts: []
	};
	
	pub.getQueryJSON(res, "CALL 列示購物車();", true, optObj, setCarts);
});

function setCarts(res, result, optObj) {
	if (!pub.isJSONEmpty(result)) {
		optObj.Success = true;
		optObj.Carts = result;
	}else {
		optObj.Success = false;
		delete Carts.Products;
	}
	
	pub.sendJSONResponse(res, optObj)
}

module.exports = router;