var express = require('express');
var router = express.Router();
var pool = require('./lib/db.js');
var pub = require('./lib/public.js');

router.post('/', function(req, res, next) {
	var reqObj = JSON.parse(JSON.stringify(req.body));
	var orderId = reqObj.OrderId;
	
	var optObj = {
		Status: false,
		Success: false,
		OrderInfo: {},
		Customers: [],
		Conditions: []
	};
	
	try {
		if (
			orderId > 16777215
		   ) {
			pub.sendBadResponse(res, optObj);
			return;
		   }
	}catch (e) {
		pub.sendBadResponse(res, optObj);
		return;
	}
	
	var mandate = "CALL 顯示訂單摘要 (" + orderId + ");";
	pub.getQueryJSON(res, mandate, false, optObj, setOrderInfo);
});

function setOrderInfo(res, result, optObj) {
	if (!pub.isJSONEmpty(result)) {	
		optObj.OrderInfo = result;
		
		var mandate = "CALL 列示客戶名稱();";
		pub.getQueryJSON(res, mandate, true, optObj, setCustomers);
	}else {
		optObj.Success = false;
		delete optObj.OrderInfo;
		delete optObj.Customers;
		delete optObj.Conditions;
	}
}

function setCustomers(res, result, optObj) {
	if (result.length > 0) {
		optObj.Customers = result;
		optObj.Success = true;
	}else {
		optObj.Success = false;
		delete optObj.Customers;
	}
	
	var mandate = "CALL 列示訂單狀態();";
	pub.getQueryJSON(res, mandate, true, optObj, setConditions);
}

function setConditions(res, result, optObj) {
	if (result.length > 0) {
		optObj.Conditions = result;
		optObj.Success = true;
	}else {
		optObj.Success = false;
		delete optObj.OrderInfo;
		delete optObj.Customers;
		delete optObj.Conditions;
	}
	pub.sendJSONResponse(res, optObj)
}

module.exports = router;