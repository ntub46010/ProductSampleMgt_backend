var express = require('express');
var router = express.Router();
var pool = require('./lib/db.js');
var pub = require('./lib/public.js');

var orderId, customerName, customerPhone, customerAddress, contactPerson, contactPhone, deliverFee, productTotal, 
	preDeliverDate, actDeliverDate, deliverPlace, condition, sales, ps;

router.post('/', function(req, res, next) {
	var reqObj = JSON.parse(JSON.stringify(req.body));
	orderId = reqObj.OrderId;
	customerName = reqObj.CustomerName;
	customerPhone = reqObj.CustomerPhone;	
	customerAddress = reqObj.CustomerAddress;
	contactPerson = reqObj.ContactPerson;	
	contactPhone = reqObj.ContactPhone;
	deliverFee = reqObj.DeliverFee;	
	productTotal = reqObj.ProductTotal;
	preDeliverDate = reqObj.PredictDeliverDate;
	actDeliverDate = reqObj.ActualDeliverDate;
	deliverPlace = reqObj.DeliverPlace;
	condition = reqObj.Condition;
	sales = reqObj.Sales;
	ps = reqObj.Ps;
	
	var optObj = {
		Status: false,
		Success: false
	};

	if (actDeliverDate == undefined)
		actDeliverDate = "NULL";
	else
		actDeliverDate = "'" + actDeliverDate + "'";
	
	var mandate = "CALL 編輯訂單(" + orderId + ", '" + customerName + "', '" + customerPhone + "', '" + customerAddress + "', '" + 
				contactPerson + "', '" + contactPhone + "', " + deliverFee + ", " + productTotal + ", '" + 
				preDeliverDate + "', " + actDeliverDate + ", '" + deliverPlace + "', " + condition + ", '" + sales + "', '" + ps + "');"
				
	pub.getQueryJSON(res, mandate, false, optObj, sendResponse);
});

function sendResponse(res, result, optObj) {
	if (result != undefined) {
		optObj.Success = true;
	}else {
		optObj.Success = false;
	}
	
	pub.sendJSONResponse(res, optObj)
}

module.exports = router;