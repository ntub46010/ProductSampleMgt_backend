var express = require('express');
var router = express.Router();
var pool = require('./lib/db.js');
var pub = require('./lib/public.js');

router.post('/', function(req, res, next) {
	var reqObj = JSON.parse(JSON.stringify(req.body));
	var cartId = reqObj.CartId;
	var salesId = reqObj.SalesId;
	
	var optObj = {
		Status: false,
		Success: false,
		CartName: ""
	};
	
	try {
		if (
			cartId > 16777215 ||
			salesId.length > 15
		   ) {
			pub.sendBadResponse(res, optObj);
			return;
		   }
	}catch (e) {
		pub.sendBadResponse(res, optObj);
		return;
	}

	var mandate = "CALL 刪除購物車('" + cartId + "', '" + salesId + "');";
	pub.getQueryJSON(res, mandate, false, optObj, setResponse);
});

function setResponse(res, result, optObj) {
	if (result != undefined) {
		optObj.Success = true;
		optObj.CartName = result;
	}else {
		optObj.Success = false;
		delete optObj.CartName;
	}
	
	pub.sendJSONResponse(res, optObj)
}

module.exports = router;