var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	res.render('index', { title: 'Busfinder', startNote: ' Try 700 or 701 (Electric Buses).'});
});

module.exports = router;
