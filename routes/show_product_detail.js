var express = require('express');
var router = express.Router();
var pool = require('./lib/db.js');
var pub = require('./lib/public.js');

var productId, cartId, orderId;

router.post('/', function(req, res, next) {
	var reqObj = JSON.parse(JSON.stringify(req.body));
	productId = reqObj.Id;
	cartId = reqObj.CartId;
	orderId = reqObj.OrderId;
	
	var optObj = {
		Status: false,
		Success: false,		
		ProductInfo: {
			Photo: "",
			Id: "",
			Name: "",
			Material: "",
			Color: "",
			Length: 0,
			Width: 0,
			Thick: 0,
			Price: 0,
			Ps: "",
			Stock: 0,
			SafeStock: 0
		},
		CartAmount: 0,
		OrderAmount: 0
	};

	var mandate = "CALL 顯示商品詳情('" + productId + "')";
	pub.getQueryJSON(res, mandate, false, optObj, setProductInfo);
});

function setProductInfo(res, result, optObj) {
	if (!pub.isJSONEmpty(result)) {
		optObj.Success = true;
		optObj.ProductInfo = result;
	}else {
		optObj.Success = false;
		delete optObj.ProductInfo;
	}
	
	var mandate = "CALL 檢查購物車內產品數量('" + cartId + "', '" + productId + "')";
	pub.getQueryJSON(res, mandate, false, optObj, setCartAmount);
}

function setCartAmount(res, result, optObj) { //未選擇購物車會underfined
	if (result != undefined)
		optObj.CartAmount = result.Amount;
	else
		optObj.CartAmount = 0;
	
	var mandate = "CALL 檢查訂單內產品數量('" + orderId + "', '" + productId + "')";
	pub.getQueryJSON(res, mandate, false, optObj, setOrderAmount);
}

function setOrderAmount(res, result, optObj) { //未選擇訂單會underfined
	if (result != undefined)
		optObj.OrderAmount = result.Amount;
	else
		optObj.OrderAmount = 0;
	
	pub.sendJSONResponse(res, optObj);	
}

module.exports = router;