var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	res.render('index', { title: 'Busfinder', url: 'http://www.ctabustracker.com/bustime/api/v1/getvehicles?key=JqWmRgBCHkBvZucHDAHBNkA26&vid=1684'});
});

module.exports = router;
