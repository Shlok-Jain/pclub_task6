const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    roll:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    photo:{
        type:String,
        required:true
    },
    attendance:{
        type:Number,
        required:true,
        default:0
    },
    descriptor:{
        type:Array,
        required:true
    }
})

module.exports = mongoose.model('Student',studentSchema)