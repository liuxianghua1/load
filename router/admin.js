var express = require('express')
var md5 = require('blueimp-md5')
var Admin = require('../models/admin')
var router = express.Router()
var checkLogin = require('../middlewares/check').checkLogin
var multer = require('multer')
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads')
    }, filename: function (req, file, cb) {
        // console.log('----',file)
        var exts = file.originalname.split('.')
        var ext = exts[exts.length-1]
        var tmpname =(new Date()).getTime()+parseInt(Math.random()*9999)
        cb(null, `${tmpname}.${ext}`)
    }
})
var upload = multer({
    storage: storage
})

router.post('/upload', upload.single('hehe'), function (req, res) {
    // console.log(req.file)
    var { size, mimetype, path } = req.file
    // console.log("路径"+req.file.path)
    var types = ['jpg', 'jpeg', 'png', 'gif']//运行上传的类型
    var tmpType = mimetype.split('/')[1]
    if (size > 5000000) {
        return res.send({ err_code: -1, message: '尺寸过大' })
    } else if (types.indexOf(tmpType) == -1) {
        return res.send({ err_code: -2, message: '类型错误' })
    } else {
        var url = `/public/uploads/${req.file.filename}`
        res.send({ err_code: 0, message: 'Ok',img:url}) 
    }

})
router.get('/demo', function (req, res) {
    res.render('admin/demo.html')
})
router.get('/admin', function (req, res) {
    res.render('admin/admin.html')
})

router.post('/admin', function (req, res) {
    var body = req.body

    //    console.log(body.loginname)
    Admin.findOne({
        loginname: body.loginname,
        password: md5(md5(body.password) + 'admin')
    }, function (err, admin) {
        if (err) {
            return res.status(500).json({
                err_code: 500,
                message: err.message
            })
        }

        if (!admin) {
            return res.status(200).json({
                err_code: 1,
                message: 'Mail or password is incorrect'
            })
        }

        // 记录登录状态
        req.session.admin = admin
        res.status(200).json({
            err_code: 0,
            message: 'Ok'
        })
    })
})

router.get('/index', checkLogin, function (req, res) {
    if (req.session.admin) {
        res.render('admin/index.html', {
            admin: req.session.admin
        })
    } else {
        res.render('404/404.html')
    }
})

router.get('/welcome', checkLogin, function (req, res) {
    res.render('admin/welcome.html')
})

router.get('/admin-add', checkLogin, function (req, res) {
    res.render('admin/admin-add.html')
})


router.get('/admin/delete', checkLogin, function (req, res) {
    var id = req.query.id
    var sessionId = req.session.admin._id
    var adminId = req.query.id
    Admin.findByIdAndRemove(id, function (err) {
        if (err) {
            return res.status(500).send('Delete error')
        }

        if (adminId === sessionId) {
            delete req.session.admin
        } else {

        }
    })
})

router.post('/admin-add', checkLogin, function (req, res) {
    var body = req.body
    // console.log(body)
    Admin.findOne({
        $or: [{
            loginname: body.loginname
        },
        {
            phone: body.phone
        }
        ]
    }, function (err, data) {
        if (err) {
            return res.status(500).json({
                err_code: 500,
                succes: false,
                message: '服务端错误'
            })
        }

        if (data) {
            return res.status(200).json({
                err_code: 1,
                message: 'The account or phone number already exists'
            })
        }

        body.password = md5(md5(body.password) + 'admin')

        new Admin(body).save(function (err, admin) {
            if (err) {
                console.log(err)
            }
            res.status(200).json({
                err_code: 0,
                message: 'ok'
            })
        })


    })

})

router.post('/admin-edit', checkLogin, function (req, res) {
    var body = req.body
    var id = body.id
    var password = { 'phone': body.phone, 'password': md5(md5(body.newpass) + 'admin') }
    var newpass = md5(md5(body.newpass) + 'admin')
    var oldpass = md5(md5(body.password) + 'admin')
    Admin.findOne({
        $and: [{
            _id: body.id,
            password: oldpass
        }]
    }, function (err, data) {
        if (!data) {
            return res.status(200).json({
                err_code: 2,
                message: 'Password in Error.'
            })
        }

        if (newpass === oldpass) {
            return res.status(200).json({
                err_code: 3,
                message: 'The new password matches the old one.'
            })
        }
        Admin.findByIdAndUpdate(id, password, function (err) {
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
})

router.get('/admin-edit', checkLogin, function (req, res) {
    var id = req.query.id
    Admin.findById(id, function (err, admin) {
        if (err) {
            return res.status(500).send('Server error.')
        }
        res.render('admin/admin-edit.html', {
            admin: admin
        }
        )
    })
})



router.get('/admin-list', checkLogin, function (req, res) {
    Admin.find(function (err, admin) {
        if (err) {
            return res.status(500).send('Server error.')
        }
        res.render('admin/admin-list.html', {
            admin: admin
        })
    })
})

router.get('/admin-role', checkLogin, function (req, res) {
    res.render('admin/admin-role.html')
})

router.get('/article-add', checkLogin, function (req, res) {
    res.render('admin/article-add.html')
})


router.get('/article-list', checkLogin, function (req, res) {
    res.render('admin/article-list.html')
})

router.get('/logout', checkLogin, function (req, res) {
    delete req.session.admin

    res.redirect('/admin');
})

module.exports = router
