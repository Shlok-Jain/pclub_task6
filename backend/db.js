const mongoose = require('mongoose')
const monogoURI = 'mongodb+srv://shlokjain0177:QLUgPX8qZwRTAg7f@cluster0.jcw8vbm.mongodb.net/'

const connectToMongo = ()=>{
    mongoose.connect(monogoURI)
}

module.exports = connectToMongo;