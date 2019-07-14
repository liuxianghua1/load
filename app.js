var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')
var app = express()
var session = require('express-session')

// 路由分离
var indexRouter = require('./router/index')
var adminRouter = require('./router/admin')

app.engine('html', require('express-art-template'))
//默认views目录
app.set('views', path.join(__dirname, './views/'))	
// 静态资源
app.use('/public', express.static(path.join(__dirname, './public/')))
app.use('/node_modules', express.static(path.join(__dirname, './node_modules/')))

app.use(bodyParser.urlencoded( { extended: false} ))
app.use(bodyParser.json())

// session
app.use(session({
	secret: 'recommand 128 bytes random string', // 使用 128 个字符的随机字符串
	resave: true,
    saveUninitialized: true,
	cookie: { maxAge: 60 * 1000 * 30}
  }));



app.use('/',adminRouter)
app.use('/',indexRouter)


app.listen(3000)
