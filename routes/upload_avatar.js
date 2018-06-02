var express = require('express');
var router = express.Router();
var multer = require('multer');
var pub = require('./lib/public.js');
var moment = require('./lib/moment-with-locales.js');

//var userId = "";

var storage = multer.diskStorage(
		{				
			destination: function (req, file, cb) {
				cb(null, "./public/avatars");
			},
			filename: function (req, file, cb) {
				var filename = "avatar_" + moment().format("YYYYMMDDhhmmss") + pub.getFileExtension(file)
				cb(null, filename);
			}		
		}	
);

//添加配置文件到muler对象。
var uploader = multer(
	{		
		storage: storage
		//,limits:{}
	}
);

router.get('/', function(req, res){
	//userId = req.param("userid"); //網頁瀏覽
	//console.log("get userid = " + req.query.userid);
    res.send(
        '<form action="/upload_avatar" method="post" enctype="multipart/form-data">'+
        '<input type="file" name="file">'+
        '<input type="submit" value="Upload">'+
        '</form>'
    );
});

router.post('/', uploader.single("file"), function(req, res, next){
    res.send(pub.getUploadedFilename(req.file.path));
});

module.exports = router;