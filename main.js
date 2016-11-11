var http = require("http");
var https = require("https");
var cheerio = require("cheerio");
var fs = require('fs');
var intetface = require('./interface.js');

function download(url, callback) {
	http.get(url, function(res) {
		var data = "";
		res.on('data', function(chunk) {
			data += chunk;
		});
		res.on("end", function() {
			callback(data);
			// console.log(data)
		});
	}).on("error", function() {
		callback(null);
	});
}

var imgArr = [];


function start(urldata) {
	var id = 0;
	download(urldata,
		function(data) {
			var $ = cheerio.load(data);
			$(data).find("img").each(function(i, e) {//获取img节点
				console.log("第" + (i + 1) + "个：" + $(e).attr("src"));
				imgArr.push($(e).attr("src"));//此处获取src的地址
				console.log("comming");
			})
			downloadImg(imgArr, id);
		}
	);
}
//start()的作用是扫描整个index文档中的img链接
//<img src="http://img0.zealer.com/40/ed/2f/cb67386c0fcc14f19c0e419ff0.jpg">

function downloadImg(resource, id) {
	//console.log(resource.length)
	var filename = resource[id].substring(resource[id].lastIndexOf('/') + 1);
	var writestream = fs.createWriteStream("image/" + filename);
	http.get(resource[id], function(res) {
		res.pipe(writestream);
	}).on("error", function() {
		console.log("下载失败");
	});;
	writestream.on('finish', function() {
		console.log("下载进度" + id + '/' + (resource.length - 1) + ': ' + filename);
		if(id < resource.length - 1) {
			id++;
			downloadImg(resource, id);
		} else {
			// num++;
			// start(num);
			return//这是针对只有一个网址的
		}
	}).on('error', function(err) {
		console.log(err)
	});
}
// 实现多个url同时抓取
var urldata=intetface.module.webArr;
for(var i = 0;i<urldata.length;i++){
	start(urldata[i]);
}
