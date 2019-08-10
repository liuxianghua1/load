var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')
var app = express()	
var session = require('express-session')
var redis = require('redis');
var RedisStore = require('connect-redis')(session);

// 连接redis数据库
var redisClient = redis.createClient(6379, '127.0.0.1', {auth_pass: '123456'});

// 路由分离
var indexRouter = require('./router/index')
var adminRouter = require('./router/admin')
var articleRouter = require('./router/article')

// 引入页面类型声明
app.engine('html', require('express-art-template'))

//默认views目录
app.set('views', path.join(__dirname, './views/'))	

// 静态资源
app.use('/public', express.static(path.join(__dirname, './public/')))
app.use('/node_modules', express.static(path.join(__dirname, './node_modules/')))

// bodypaser配置
app.use(bodyParser.urlencoded( { extended: false} ))
app.use(bodyParser.json())

// session配置
app.use(session({
	store:new RedisStore({client: redisClient}),
	secret: 'recommand 128 bytes random string', // 使用 128 个字符的随机字符串
	resave: true,
    saveUninitialized: true,
	cookie: { maxAge: 60 * 1000 * 30}
  }));

//   路由分离
app.use(articleRouter)
app.use('/',adminRouter)
app.use('/',indexRouter)



app.listen(3000,'192.168.5.90')
// 本地ip访问

// app.listen(3000)
// 127.0.0.1访问

