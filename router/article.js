var express = require('express')
var Article = require('../models/article')
var router = express.Router()
var checkLogin = require('../middlewares/check').checkLogin
var multer = require('multer')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads')
    }, filename: function (req, file, cb) {
        var exts = file.originalname.split('.')
        var ext = exts[exts.length - 1]
        var tmpname = (new Date()).getTime() + parseInt(Math.random() * 9999)
        cb(null, `${tmpname}.${ext}`)
    }
})

var upload = multer({
    storage: storage,
    // limits: { "fileSize": 5000000 }
}
    )

router.post('/upload', upload.single('hehe'), checkLogin, function (req, res) {
    
    var { size, mimetype, path } = req.file
    var types = ['jpg', 'jpeg', 'png', 'gif']//运行上传的类型
    var tmpType = mimetype.split('/')[1]
    if (size > 5000000) {
        return res.status(200).json({ err_code: -1, message: '尺寸过大' })
    } else if (types.indexOf(tmpType) == -1) {
        return res.status(200).json({ err_code: -2, message: '类型错误' })
    } else {
        res.status(200).json({
            err_code: 0,
            message: 'ok',
            img: req.file.path
        })
    }
})




router.post('/article-add', checkLogin, function (req, res) {
    var body = req.body
    new Article(body).save(function (err, data) {
        if (err) {
            return res.status(500).json({
                err_code: 500,
                message: 'Server Error'
            })
        }

        res.status(200).json({
            err_code: 0,
            message: 'ok'
        })
    })

})

router.post('/article-edit', checkLogin, function (req, res) {
    var body = req.body
    var id = req.body.id
    Article.findByIdAndUpdate(id, body, function (err) {
        if (err) {
            console.log(err)
            return res.status(500).json({
                err_code: 500,
                message: '服务端错误'
            })
        } else {
            res.status(200).json({
                err_code: 0,
                message: 'ok'
            })
        }
    })
})

router.get('/article-delete', checkLogin, function (req, res) {
    var id = req.query.id
    Article.findByIdAndRemove(id, function (err) {
        if (err) {
            return res.status(500).json({
                err_code: 500,
                message: 'Server Error'
            })
        }
    })
})



router.get('/article-add', checkLogin, function (req, res) {
    res.render('admin/article-add.html', {
        admin: req.session.admin
    })
})

router.get('/article-edit', checkLogin, function (req, res) {
    var id = req.query.id
    Article.findById(id, function (err, article) {
        if (err) {
            return res.status(500).send('Server error.')
        }
        res.render('admin/article-edit.html', {
            admin: req.session.admin,
            article: article

        }
        )
    })
})

router.get('/article-Show', function (req, res) {
    Article.find(function (err, article) {

        if (err) {
            return res.status(500).send('Server error.')
        }
        res.render('admin/atricle-Show.html', {
            article: article
        })
    }).sort([['_id', -1]])
    // .countDocuments(function(err, counts) {
    //     console.log('总共有'+counts+'条数据')
    //     res.json({counts:counts})
    // })
})


router.get('/imgshow', checkLogin, function (req, res) {
    var id = req.query.id
    Article.findById(id, function (err, article) {
        if (err) {
            return res.status(500).send('Server error.')
        }
        res.render('admin/imgshow.html', {
            article: article,

        }
        )
    })
})


router.get('/article-list', checkLogin, function (req, res) {
    Article.find(function (err, article) {
        if (err) {
            return res.status(500).send('Server error.')
        }
        res.render('admin/article-list.html', {
            article: article
        })
    }).sort([['_id', -1]])
})


router.get('/article', function (req, res) {
    var id = req.query.id
    Article.findById(id, function (err, article) {
        if (err) {
            return res.status(500).render('404/404.html')
        }
        res.render('admin/article.html', {
            article: article
        }
        )

    })

})


module.exports = router
