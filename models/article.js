var mongoose = require('mongoose')
var moment = require('moment')
moment.locale('zh-cn')
var today = moment().format('YYYY-MM-DD');
mongoose.set('useFindAndModify', false)
var Schema = mongoose.Schema
var articleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    Image: {
        type: String
    },
    dateline: {
        type: String,
        default: today
    },
    promulgator: {
        type: String,
    }
})

module.exports = mongoose.model('Article', articleSchema)