var mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)
var Schema = mongoose.Schema

var demandSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    submit_time: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Demand', demandSchema)