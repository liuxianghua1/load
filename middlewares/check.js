module.exports = {
    checkLogin: function checkLogin (req, res, next) {
      if (!req.session.admin) {
        return res.render('404/404.html')
        // 未登录读取404页面
      }
      next()
    },
  
    checkNotLogin: function checkNotLogin (req, res, next) {
      if (req.session.admin) {
        req.flash('error', '已登录')
        return res.redirect('back')// 返回之前的页面
      }
      next()
    }
  }
