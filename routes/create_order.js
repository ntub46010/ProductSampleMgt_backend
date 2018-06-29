var express = require('express');
var router = express.Router();
var pool = require('./lib/db.js');
var pub = require('./lib/public.js');

var products;

router.post('/', function(req, res, next) {
	var reqObj = JSON.parse(JSON.stringify(req.body));
	var customerName = reqObj.CustomerName;
	var customerPhone = reqObj.CustomerPhone;	
	var customerAddress = reqObj.CustomerAddress;
	var contactPerson = reqObj.ContactPerson;	
	var contactPhone = reqObj.ContactPhone;
	var deliverFee = reqObj.DeliverFee;	
	var productTotal = reqObj.ProductTotal;
	var deliverDate = reqObj.PredictDeliverDate;
	var deliverPlace = reqObj.DeliverPlace;
	var sales = reqObj.Sales;
	var ps = reqObj.Ps;
	var cartId = reqObj.CartId;	
	products = reqObj.Products
	
	var optObj = {
		Status: false,
		Success: false,
		OrderId: 0,
		IsLower: false
	};
	
	try {
		if (
			customerName.length > 50 ||
			customerPhone.length > 15 ||
			customerAddress.length > 100 ||
			contactPerson.length > 20 ||
			contactPhone.length > 15 ||
			deliverFee > 16777215 ||
			productTotal > 4294967295 ||
			deliverDate.length > 20 ||
			deliverPlace.length > 100 ||
			sales.length > 15 ||
			ps.length > 100 ||
			cartId > 16777215
		   ) {
			pub.sendBadResponse(res, optObj);
			return;
		   }
		   
		   for (var i = 0; i < products.length; i++) {
			   if (
				products[i].Id > 65535 ||
				products[i].Amount > 4294967295
			   ) {
				pub.sendBadResponse(res, optObj);
				return;
			   }
		   }
		   
	}catch (e) {
		pub.sendBadResponse(res, optObj);
		return;
	}

	var mandate = "CALL 新增訂單('" + customerName + "', '" + customerPhone + "', '" + customerAddress + "', '" + 
				contactPerson + "', '" + contactPhone + "', " + deliverFee + ", " + productTotal + ", '" + 
				deliverDate + "', '" + deliverPlace + "', '" + sales + "', '" + ps + "', '" + cartId + "');"
	pub.getQueryJSON(res, mandate, false, optObj, createOrder);
});

function createOrder(res, result, optObj) {
	if (!pub.isJSONEmpty(result)) {
		optObj.OrderId = result.OrderId;	
		insertProduct(res, result, optObj);	
	}else {
		delete optObj.OrderId;
		sendResponse(res, result, optObj);
	}
}

function insertProduct(res, result, optObj) {
	for (var i = 0; i < products.length; i++) {
		var mandate = "CALL 異動訂單項目(" + optObj.OrderId + ", '" + products[i].Id + "', " + products[i].Amount + ");";
		
		pub.getQueryJSON(res, mandate, false, optObj, checkStock);
		
		if (i == products.length - 1)
			pub.getQueryJSON(res, mandate, false, optObj, sendResponse);
	}
}

function checkStock(res, result, optObj) {console.log(result);
	if (!pub.isJSONEmpty(result)) {
		if (result.Stock < result.SafeStock)
			optObj.IsLower = true;		
	}	
}

function sendResponse(res, result, optObj) {
	if (result != undefined) {
		optObj.Success = true;
	}else {
		optObj.Success = false;	
		delete optObj.OrderId;	
	}
	
	pub.sendJSONResponse(res, optObj);
}

module.exports = router;