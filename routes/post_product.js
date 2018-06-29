var express = require('express');
var router = express.Router();
var pool = require('./lib/db.js');
var pub = require('./lib/public.js');

router.post('/', function(req, res, next) {
	var reqObj = JSON.parse(JSON.stringify(req.body));
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
		ProductInfo: {
			Id: "",
			Name: ""
		}
	};
	
	try {
		if (
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

	var mandate = "CALL 新增產品('" + name + "', '" + material + "', '" + color + "', '" + length + "', '" + width + "', '" + thick + "', '"
					+ stock + "', '" + safeStock + "', '" + price + "', '" + photo + "', '" + ps + "');";
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
	
	pub.sendJSONResponse(res, optObj)
}

module.exports = router;