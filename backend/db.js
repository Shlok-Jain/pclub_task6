const mongoose = require('mongoose')
const monogoURI = 'YOUR URI'

const connectToMongo = ()=>{
    mongoose.connect(monogoURI)
}

module.exports = connectToMongo;
