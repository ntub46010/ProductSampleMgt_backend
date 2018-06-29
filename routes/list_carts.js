var express = require('express');
var router = express.Router();
var pool = require('./lib/db.js');
var pub = require('./lib/public.js');

router.post('/', function(req, res, next) {
	var reqObj = JSON.parse(JSON.stringify(req.body));
	var salesId = reqObj.SalesId;
	
	var optObj = {
		Status: false,
		Success: false,
		Carts: []
	};
	
	try {
		if (
			salesId.length > 15
		   ) {
			pub.sendBadResponse(res, optObj);
			return;
		   }
	}catch (e) {
		pub.sendBadResponse(res, optObj);
		return;
	}
	
	var mandate = "CALL 列示購物車('" + salesId + "');";
	pub.getQueryJSON(res, mandate, true, optObj, setCarts);
});

function setCarts(res, result, optObj) {
	if (result.length > 0) {
		optObj.Success = true;
		optObj.Carts = result;
	}else {
		optObj.Success = false;
		delete optObj.Carts;
	}
	
	pub.sendJSONResponse(res, optObj)
}

module.exports = router;