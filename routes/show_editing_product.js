var express = require('express');
var router = express.Router();
var pool = require('./lib/db.js');
var pub = require('./lib/public.js');

var productId;

router.post('/', function(req, res, next) {
	var reqObj = JSON.parse(JSON.stringify(req.body));
	productId = reqObj.Id;
	
	var optObj = {
		Status: false,
		Success: false,
		Materials: [],
		Colors: [],
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
		ProductAdmin: []
	};
	
	try {
		if (
			productId > 65535
		   ) {
			pub.sendBadResponse(res, optObj);
			return;
		   }
	}catch (e) {
		pub.sendBadResponse(res, optObj);
		return;
	}

	pub.getQueryJSON(res, "CALL 顯示商品詳情('" + productId + "');", false, optObj, setProductInfo);
});


function setProductInfo(res, result, optObj) {
	if (!pub.isJSONEmpty(result)) {
		optObj.Success = true;
		optObj.ProductInfo = result;
	}else {
		optObj.Success = false;
		delete optObj.ProductInfo;
	}
	
	pub.getQueryJSON(res, "CALL 顯示材質();", true, optObj, setMaterial);
}

function setMaterial(res, result, optObj) {
	optObj.Materials = result;
	pub.getQueryJSON(res, "CALL 顯示顏色();", true, optObj, setColor);
}

function setColor(res, result, optObj) {
	optObj.Colors = result;	
	pub.getQueryJSON(res, "CALL 列示產品管理員();", true, optObj, setProductAdmin);
}


function setProductAdmin(res, result, optObj) {
	if (result.length > 0) {
		optObj.ProductAdmin = result;
		optObj.Success = true;
	}else {
		delete optObj.ProductAdmin;
		optObj.Success = false;
	}
	
	pub.sendJSONResponse(res, optObj);
}

module.exports = router;