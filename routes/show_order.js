var express = require('express');
var router = express.Router();
var pool = require('./lib/db.js');
var pub = require('./lib/public.js');

var orderId;

router.post('/', function(req, res, next) {
	var reqObj = JSON.parse(JSON.stringify(req.body));
	orderId = reqObj.OrderId;
	
	var optObj = {
		Status: false,
		Success: false,
		OrderInfo: {},
		Products: []
	};
	
	var mandate = "CALL 顯示訂單摘要 (" + orderId + ");";
	pub.getQueryJSON(res, mandate, false, optObj, setOrderInfo);
});

function setOrderInfo(res, result, optObj) {
	if (!pub.isJSONEmpty(result)) {	
		optObj.OrderInfo = result;
		
		var mandate = "CALL 顯示訂單產品明細 (" + orderId + ");";
		pub.getQueryJSON(res, mandate, true, optObj, setProducts);
	}else {
		optObj.Success = false;
		delete optObj.OrderInfo;
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
		delete optObj.OrderInfo;
		delete optObj.Products;		
	}
	
	pub.sendJSONResponse(res, optObj);	
}

module.exports = router;