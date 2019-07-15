var mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)
mongoose.connect('mongodb://localhost/load', {useNewUrlParser: true})
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
    }
})

module.exports = mongoose.model('Article', articleSchema)