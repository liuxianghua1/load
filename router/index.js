var express = require('express')
var router = express.Router()

router.get('/', function(req, res) {
    res.render('load.html')
    
})

router.get('*', function index(req, res) {
	res.render('404/404.html')
})

module.exports = router