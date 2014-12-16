var express = require('express');
var router = express.Router();
var http = require('http');
var parseString = require('xml2js').parseString;

//var ctaKey = 'JqWmRgBCHkBvZucHDAHBNkA26';
var ctaKey = process.env.CTAAPIKEY;

/* GET bus listing. */
router.get('/:id', function(req, res) {
	var busId = req.params.id;

	var options = {
		hostname:'ctabustracker.com',
		path:'/bustime/api/v1/getvehicles?key='+ctaKey+'&vid='+busId,
		method: 'GET'
	};

	//ajax call to CTA API
	var ctaData = http.get(options, function(response){
		response.setEncoding('utf8');
		response.on('data', function (chunk) {
			// console.log(chunk);

			//parses XML into JSON
			parseString(chunk, function(err,result){
				res.send(result);	
				// console.log(result);
			});

			
		});
	});

	ctaData.on('error', function(e){
		console.log('error on the request: '+e.message);
	});


});

module.exports = router;
