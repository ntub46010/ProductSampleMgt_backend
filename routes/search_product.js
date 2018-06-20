var express = require('express');
var router = express.Router();
var pool = require('./lib/db.js');
var pub = require('./lib/public.js');

var keyword ,onSale, searchMode;

router.post('/', function(req, res, next) {
	var reqObj = JSON.parse(JSON.stringify(req.body));
	keyword = reqObj.Keyword;
	onSale = reqObj.OnSale;
	searchMode = reqObj.SearchMode;
	
	var optObj = {
		Status: false,
		Success: false,
		Products: []
	};
	
	var mandate = "('" + keyword + "', " + onSale + ");";
	switch (searchMode) {
		case 1:
			mandate = "CALL 搜尋產品_編號" + mandate;
			break;
		case 2:
			mandate = "CALL 搜尋產品_名稱" + mandate;
			break;
		case 3:
			mandate = "CALL 搜尋產品_材質" + mandate;
			break;
		case 4:
			mandate = "CALL 搜尋產品_顏色" + mandate;
			break;
		default:
			mandate = "CALL 搜尋產品_名稱" + mandate;
			break;
	}
	
	
	pub.getQueryJSON(res, mandate, true, optObj, setProducts);
});

function setProducts(res, result, optObj) {
	if (result.length > 0) {
		optObj.Success = true;
		optObj.Products = result;
	}else {
		optObj.Success = false;
		delete optObj.Products;
	}
	
	pub.sendJSONResponse(res, optObj)
}

module.exports = router;