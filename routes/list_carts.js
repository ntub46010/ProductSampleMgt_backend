var express = require('express');
var router = express.Router();
var pool = require('./lib/db.js');
var pub = require('./lib/public.js');

var salesId;

router.post('/', function(req, res, next) {
	var reqObj = JSON.parse(JSON.stringify(req.body));
	salesId = reqObj.SalesId;
	
	var optObj = {
		Status: false,
		Success: false,
		Carts: []
	};
	
	pub.getQueryJSON(res, "CALL 列示購物車('" + salesId + "');", true, optObj, setCarts);
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