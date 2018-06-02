var express = require('express');
var router = express.Router();
var pool = require('./lib/db.js');
var pub = require('./lib/public.js');

router.post('/', function(req, res, next) {
	var reqObj = JSON.parse(JSON.stringify(req.body));
	//var Id = reqObj.Id;	
	console.log(reqObj);
	
	var optObj = {
		Status: false,
		Male: [],
		Female: []
	};
	
	pub.getQueryJSON(res, "select * from Student where Gender = '1'", true, optObj, setMale);
});

function setMale(res, result, optObj) {
	optObj.Male = result;
	pub.getQueryJSON(res, "select * from Student where Gender = '0'", true, optObj, setFemale);
}

function setFemale(res, result, optObj) {
	optObj.Female = result;	
	pub.sendJSONResponse(res, optObj)
}

module.exports = router;