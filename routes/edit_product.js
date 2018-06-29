var express = require('express');
var router = express.Router();
var pool = require('./lib/db.js');
var pub = require('./lib/public.js');

var editMode;

router.post('/', function(req, res, next) {
	var reqObj = JSON.parse(JSON.stringify(req.body));
	editMode = reqObj.EditMode;
	var productId = reqObj.Id;
	var name = reqObj.Name;
	var material = reqObj.Material;
	var color = reqObj.Color;
	var len = reqObj.Length;
	var width = reqObj.Width;
	var thick = reqObj.Thick;
	var stock = reqObj.Stock;
	var safeStock = reqObj.SafeStock;
	var price = reqObj.Price;
	var photo = reqObj.Photo;
	var ps = reqObj.Ps;
	
	var optObj = {
		Status: false,
		Success: false,
		IsLower: false,
		ProductInfo: {
			Id: "",
			Name: ""
		}
	};
	
	try {
		if (
			editMode < 1 ||
			productId > 65535 ||
			name.length > 30 ||
			material.length > 20 ||
			color.length > 20 ||
			len > 65535 ||
			width > 65535 ||
			thick > 65535 ||
			stock > 4294967295 ||
			safeStock > 4294967295 ||
			price > 16777215 ||
			photo.length > 30 ||
			ps.length > 100
		   ) {
			pub.sendBadResponse(res, optObj);
			return;
		   }
	}catch (e) {
		pub.sendBadResponse(res, optObj);
		return;
	}
	
	var mandate = "CALL 編輯產品('" + productId + "', '" + name + "', '" + material + "', '" + color + "', '" + length + "', '" + width + "', '" + thick + "', '"
					+ stock + "', '" + safeStock + "', '" + price + "', '" + photo + "', '" + ps + "', ";
					
	if (editMode == 1 || editMode == 2) {
		mandate += editMode + ");";
	}else if (editMode == 3) {
		mandate = "CALL 下架產品('" + productId + "');";
	}
	
	pub.getQueryJSON(res, mandate, false, optObj, setProductInfo);
});

function setProductInfo(res, result, optObj) {
	if (result != undefined) {
		optObj.Success = true;
		if (editMode == 1 || editMode == 2) {
			optObj.ProductInfo = result;
			optObj.IsLower = result.Stock < result.SafeStock;
		}else if (editMode == 3) {
			delete optObj.ProductInfo;
			delete optObj.IsLower;
		}		
	}else {
		optObj.Success = false;
		delete optObj.ProductInfo;
	}
	
	pub.sendJSONResponse(res, optObj)
}

module.exports = router;