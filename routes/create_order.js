var express = require('express');
var router = express.Router();
var pool = require('./lib/db.js');
var pub = require('./lib/public.js');

var customerName, customerPhone, customerAddress, contactPerson, contactPhone, deliverFee, productTotal, 
	deliverDate, deliverPlace, sales, ps, cartId;
var products;

router.post('/', function(req, res, next) {
	var reqObj = JSON.parse(JSON.stringify(req.body));
	customerName = reqObj.CustomerName;
	customerPhone = reqObj.CustomerPhone;	
	customerAddress = reqObj.CustomerAddress;
	contactPerson = reqObj.ContactPerson;	
	contactPhone = reqObj.ContactPhone;
	deliverFee = reqObj.DeliverFee;	
	productTotal = reqObj.ProductTotal;
	deliverDate = reqObj.PredictDeliverDate;
	deliverPlace = reqObj.DeliverPlace;
	sales = reqObj.Sales;
	ps = reqObj.Ps;
	cartId = reqObj.CartId;
	
	products = reqObj.Products
	
	var optObj = {
		Status: false,
		Success: false,
		OrderId: 0,
		IsLower: false
	};

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