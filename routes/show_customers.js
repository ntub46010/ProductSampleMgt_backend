var express = require('express');
var router = express.Router();
var pool = require('./lib/db.js');
var pub = require('./lib/public.js');

router.post('/', function(req, res, next) {
	var optObj = {
		Status: false,
		Success: false,
		Customers: [],
		Warehouse: []
	};
	
	pub.getQueryJSON(res, "CALL 顯示客戶名稱();", true, optObj, setCustomers);
});

function setCustomers(res, result, optObj) {
	if (result.length > 0) {
		optObj.Customers = result;
		optObj.Success = true;
	}else {
		delete optObj.Customers;
		optObj.Success = false;
	}
	
	pub.getQueryJSON(res, "CALL 列示倉管人員();", true, optObj, setWarehouse);
}

function setWarehouse(res, result, optObj) {
	if (result.length > 0) {
		optObj.Warehouse = result;
		optObj.Success = true;
	}else {
		delete optObj.Warehouse;
		optObj.Success = false;
	}
	
	pub.sendJSONResponse(res, optObj)
}

module.exports = router;