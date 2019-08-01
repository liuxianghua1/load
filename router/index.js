var express = require('express')
var Article = require('../models/article')
var router = express.Router()

router.get('/', function(req, res) {
    Article.find(function (err, article) {
        if (err) {
            return res.status(500).send('Server error.')
        }
        res.render('load.html',{
        article: article
         })
    }).sort([['_id',-1]]).limit(4)
})



router.get('*', function index(req, res) {
	res.render('404/404.html')
})

module.exports = router