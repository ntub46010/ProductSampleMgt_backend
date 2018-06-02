var express = require('express');
var router = express.Router();
var pool = require('./lib/db.js');
var pub = require('./lib/public.js');

router.post('/', function(req, res, next) {
	var reqObj = JSON.parse(JSON.stringify(req.body));
	var userId = reqObj.UserId;;
	
	var optObj = {
		Status: false,
		Success: false,
		Notifications: []
	};
	
	pub.getQueryJSON(res, "CALL 列示通知('" + userId + "');", true, optObj, setNotifications);
});

function setNotifications(res, result, optObj) {
	if (result.length > 0) {
		optObj.Success = true;
		optObj.Notifications = result;
	}else {
		optObj.Success = false;
		delete optObj.Notifications;
	}
	
	pub.sendJSONResponse(res, optObj)
}

module.exports = router;