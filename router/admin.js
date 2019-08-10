var express = require('express')
var md5 = require('blueimp-md5')
var Admin = require('../models/admin')
var Demand = require('../models/demand')
var router = express.Router()
var checkLogin = require('../middlewares/check').checkLogin



router.get('/admin', function (req, res) {
    res.render('admin/admin.html')
})

router.get('/contentShow', checkLogin,function (req, res) {
    // 获取id
    var id = req.query.id
    // 根据id查找内容
    Demand.findById(id, function (err, demand) {
        if (err) {
            return res.status(500).send('Server error.')
        }
        res.render('admin/contentShow.html', {
            demand: demand
        }
        )
    })
})

router.get('/demand-delete', checkLogin, function (req, res) {
    var id = req.query.id
    Demand.findByIdAndRemove(id, function (err) {
        if (err) {
            return res.status(500).json({
                err_code: 500,
                message: 'Server Error'
            })
        }
    })
})



router.post('/admin', function (req, res) {
    // 表单数据
    var body = req.body
    // 账号密码比对
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

        // 账号或者密码错误
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
    // 获取点击的id
    var id = req.query.id
    // 获取session的id
    var sessionId = req.session.admin._id
    // 获取点击的id
    var adminId = req.query.id
    // 根据点击id删除
    Admin.findByIdAndRemove(id, function (err) {
        if (err) {
            return res.status(500).send('Delete error')
        }
        // 如果删除id = 当前登录id 则删除session状态 并跳转404
        if (adminId === sessionId) {
            
            delete req.session.admin
            res.redirect('/404');
        } 
    })
})

router.post('/admin-add', checkLogin, function (req, res) {
    // 获取表单数据
    var body = req.body
    Admin.findOne({
        // 数据库中查询 保证用户 手机号唯一
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

        // 说明手机号或者用户名有一相同
        if (data) {
            return res.status(200).json({
                err_code: 1,
                message: 'The account or phone number already exists'
            })
        }

        // 给密码进行2次md5并且字符串加密
        body.password = md5(md5(body.password) + 'admin')
        // 将获取到的表单数据保存到数据库
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
    // 获取表单数据
    var body = req.body
    var id = body.id
    // 提交2个数据
    var password = { 'phone': body.phone, 'password': md5(md5(body.newpass) + 'admin') }
    // 表单新密码
    var newpass = md5(md5(body.newpass) + 'admin')
    // 表单旧密码
    var oldpass = md5(md5(body.password) + 'admin')
    // 数据库里的密码和表单的旧密码进行比对 错误则不让修改
    Admin.findOne({
        $and: [{
            _id: body.id,
            password: oldpass
        }]
    }, function (err, data) {
        // 旧密码错误
        if (!data) {
            return res.status(200).json({
                err_code: 2,
                message: 'Password in Error.'
            })
        }
        // 新密码和旧密码一样 不让修改
        if (newpass === oldpass) {
            return res.status(200).json({
                err_code: 3,
                message: 'The new password matches the old one.'
            })
        }
        // 根据id更新
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
    // 获取id 然后根据id显示数据
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

router.get('/demand-list', checkLogin, function (req, res) {
    // 需求显示
    Demand.find(function (err, demand) {
        if (err) {
            return res.status(500).send('Server error.')
        }
        res.render('admin/demand-list.html', {
            demand: demand
        }
        )
    })
})

router.post('/demand', function(req, res) {
    // 获取表单数据发送需求
    var body = req.body
        new Demand(body).save(function (err, demand) {
            if (err) {
                console.log(err)
            }
            res.status(200).json({
                err_code: 0,
                message: 'ok'
            })
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

router.get('/logout', checkLogin, function (req, res) {
    delete req.session.admin

    res.redirect('/admin');
})

module.exports = router
