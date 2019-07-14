var express = require('express')
var md5 = require('blueimp-md5')
var Admin = require('../models/admin')
var router = express.Router()
var checkLogin = require('../middlewares/check').checkLogin

router.get('/admin', function(req, res) {
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



router.get('/index', checkLogin, function(req, res) {
    if (req.session.admin) {
       res.render('admin/index.html', {
		 admin: req.session.admin
	})
    }else{
        res.render('404/404.html')
    }
})

router.get('/welcome', checkLogin, function(req, res) {
    res.render('admin/welcome.html')
})

router.get('/admin-add', checkLogin, function(req, res) {
    res.render('admin/admin-add.html')
})


router.get('/admin/delete', checkLogin, function(req,res){
    var id = req.query.id
    var sessionId= req.session.admin._id
    var adminId=req.query.id
    Admin.findByIdAndRemove(id,function(err){
      if (err) {
          return res.status(500).send('Delete error')
      }

      if ( adminId === sessionId) {
        delete req.session.admin
      } else {

      }
    })
})

router.post('/admin-add',  checkLogin, function(req, res){
	var body = req.body
    // console.log(body)
    Admin.findOne({
        $or: [{
            loginname : body.loginname
            },
            {
            phone : body.phone
            }
        ]
    }, function(err, data) {
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

router.get('/admin-edit', checkLogin, function(req, res) {
    res.render('admin/admin-edit.html')
})

router.get('/admin-list', checkLogin, function(req, res) {
    Admin.find(function (err, admin) {
        if (err) {
            return res.status(500).send('Server error.')
        }
        res.render('admin/admin-list.html', {
            admin : admin
        })
    })
})

router.get('/admin-role', checkLogin, function(req, res) {
    res.render('admin/admin-role.html')
})

router.get('/order-add', checkLogin, function(req, res) {
    res.render('admin/order-add.html')
})

router.get('/order-list', checkLogin, function(req, res) {
    res.render('admin/order-list.html')
})

router.get('/logout', checkLogin, function (req, res) {
    delete req.session.admin

    res.redirect('/admin');	
})

module.exports = router
