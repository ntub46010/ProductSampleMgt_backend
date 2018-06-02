var express = require('express');
var router = express.Router();
var pool = require('./lib/db.js');
var pub = require('./lib/public.js');

var cartId, salesId;

router.post('/', function(req, res, next) {
	var reqObj = JSON.parse(JSON.stringify(req.body));
	cartId = reqObj.CartId;
	salesId = reqObj.SalesId;
	
	var optObj = {
		Status: false,
		Success: false,
		CartName: ""
	};

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