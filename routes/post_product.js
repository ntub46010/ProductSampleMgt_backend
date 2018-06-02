var express = require('express');
var router = express.Router();
var pool = require('./lib/db.js');
var pub = require('./lib/public.js');

var name, material, color, length, width, thick, stock, safeStock, price, photo, ps;

router.post('/', function(req, res, next) {
	var reqObj = JSON.parse(JSON.stringify(req.body));
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