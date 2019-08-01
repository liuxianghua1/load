var mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)
mongoose.connect('mongodb://localhost/load', {useNewUrlParser: true})
var Schema = mongoose.Schema
var adminSchema = new Schema({
    loginname: {
        type: String,
        required: true
    },
    phone: {
        type:Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    create_time: {
        type: String,
        default: Date.now
    },
    status: {
        // 状态 0为启用 1为停用
        type: Number,
        enum: [0,1],
        default: 0
    }
})

module.exports = mongoose.model('Admin', adminSchema)