var express = require('express');
var router = express.Router();
var pool = require('./lib/db.js');
var pub = require('./lib/public.js');

var editMode, productId, name, material, color, length, width, thick, stock, safeStock, price, photo, ps;

router.post('/', function(req, res, next) {
	var reqObj = JSON.parse(JSON.stringify(req.body));
	editMode = reqObj.EditMode;
	productId = reqObj.Id;
	name = reqObj.Name;
	material = reqObj.Material;
	color = reqObj.Color;
	length = reqObj.Length;
	width = reqObj.Width;
	thick = reqObj.Thick;
	stock = reqObj.Stock;
	safeStock = reqObj.SafeStock;
	price = reqObj.Price;
	photo = reqObj.Photo;
	ps = reqObj.Ps;
	
	var optObj = {
		Status: false,
		Success: false,
		ProductInfo: {
			Id: "",
			Name: ""
		}
	};
	
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
		}else if (editMode == 3) {
			delete optObj.ProductInfo;
		}		
	}else {
		optObj.Success = false;
		delete optObj.ProductInfo;
	}
	
	pub.sendJSONResponse(res, optObj)
}

module.exports = router;