var express = require('express');
var router = express.Router();
var pool = require('./lib/db.js');
var pub = require('./lib/public.js');

var orderId, customerName, customerPhone, customerAddress, contactPerson, contactPhone, deliverFee, productTotal, 
	preDeliverDate, actDeliverDate, deliverPlace, condition, sales, ps;

router.post('/', function(req, res, next) {
	var reqObj = JSON.parse(JSON.stringify(req.body));
	var orderId = reqObj.OrderId;
	var customerName = reqObj.CustomerName;
	var customerPhone = reqObj.CustomerPhone;	
	var customerAddress = reqObj.CustomerAddress;
	var contactPerson = reqObj.ContactPerson;	
	var contactPhone = reqObj.ContactPhone;
	var deliverFee = reqObj.DeliverFee;	
	var productTotal = reqObj.ProductTotal;
	var preDeliverDate = reqObj.PredictDeliverDate;
	var actDeliverDate = reqObj.ActualDeliverDate;
	var deliverPlace = reqObj.DeliverPlace;
	var condition = reqObj.Condition;
	var sales = reqObj.Sales;
	var ps = reqObj.Ps;
	
	var optObj = {
		Status: false,
		Success: false
	};
	
	try {
		if (
			orderId > 16777215 ||
			customerName.length > 50 ||
			customerPhone.length > 15 ||
			customerAddress.length > 100 ||
			contactPerson.length > 20 ||
			contactPhone.length > 15 ||
			deliverFee > 16777215 ||
			productTotal > 4294967295 ||
			preDeliverDate.length > 20 ||
			actDeliverDate.length > 20 ||
			deliverPlace.length > 100 ||
			condition > 255 ||
			sales.length > 15 ||
			ps.length > 100
		   ) {
			pub.sendBadResponse(res, optObj);
			return;
		   }
	}catch (e) {
		pub.sendBadResponse(res, optObj);
		return;
	}

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