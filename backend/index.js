const express = require('express')
const app = express()
const cors = require('cors')
const connectToMongo = require('./db')
const fileUpload = require('express-fileupload');
const path = require('path')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid');
connectToMongo()
app.use(cors())
app.use( express.json({'limit':'10mb'}) );
app.use(fileUpload())
const { loadModels, getFaceDescriptor } = require('./faceApi');
const faceapi = require('face-api.js');
const Student = require('./modules/Student')
const admin_pass = 'admin123'
const jwt = require('jsonwebtoken');
const JWT_SECRET = "asdf"
var studentDescriptors = [];

app.post('/student',async(req,res)=> {
    const {roll,password} = req.body
    const requestedStudent = await Student.findOne({roll:roll})
    if(requestedStudent){
        if(requestedStudent.password === password){
            return res.json({'success':true,'attendance':requestedStudent.attendance})
        }
        else{
            return res.json({'success':false,'message':'Invalid Password'})
        }
    }
    else{
        return res.json({'success':false,'message':'Student Not Found'})
    }
})

app.post('/addstudent',async(req,res)=> {
    const {roll,name,password,photo} = req.body;
    const token = req.headers.token
    if(!token){
        return res.json({'success':false,'message':'Unauthorized'})
    }
    try{
        const decoded = jwt.verify(token,JWT_SECRET)
    }
    catch(e){
        return res.json({'success':false,'message':'Unauthorized'})
    }
    const already = await Student.findOne({roll:roll})
    if(already){
        return res.json({'success':false,'message':'Student Already Exists'})
    }
    const matches = photo.match(/^data:image\/png;base64,(.+)$/);
    if (!matches) {
      return res.status(400).send('Invalid image format.');
    }
    const base64Data = matches[1];
    const buffer = Buffer.from(base64Data, 'base64');
    const filename = uuidv4()+'.png'
    try{
        fs.writeFileSync(path.join(__dirname,'Photos',filename),buffer)
    }
    catch(err){
        return res.json({'success':false,'message':'Error Saving Photo'})
    }
    try{
        const desc = await getStudentDescriptor(path.join(__dirname,'Photos',filename),roll,name)
        if(!desc || desc == null){
            return res.json({'success':false,'message':'No Face Found in Image. Take photo clearly with plain background and no glasses or mask. Also uniform lighting is required.'})
        }
        const student = await Student.create({roll:roll,name:name,password:password,photo:filename,attendance:0,descriptor:desc})
        return res.json({'success':true,'message':`Student ${name}(${roll}) added`})
    }
    catch(err){
        return res.json({'success':false,'message':'Error Adding Student'})
    }
})

app.post('/adminlogin',async(req,res)=> {
    const {password} = req.body
    if(password===admin_pass){
        const token = jwt.sign({password},JWT_SECRET)
        return res.json({'success':true,'token':token})
    }
    else{
        return res.json({'success':false})
    }
})

app.post('/getstudentsattendance',async(req,res)=> {
    const token = req.headers.token
    if(!token){
        return res.json({'success':false,'message':'Unauthorized'})
    }
    try{
        const decoded = jwt.verify(token,JWT_SECRET)
    }
    catch(e){
        return res.json({'success':false,'message':'Unauthorized'})
    }
    const students = await Student.find({})
    return res.json({'success':true,'students':students})
})

app.post('/markattendance',async(req,res)=> {
    const token = req.headers.token;
    const {photo} = req.body;
    if(!token){
        return res.json({'success':false,'message':'Unauthorized'})
    }
    try{
        const decoded = jwt.verify(token,JWT_SECRET)
    }
    catch(e){
        return res.json({'success':false,'message':'Unauthorized'})
    }
    const matches = photo.match(/^data:image\/png;base64,(.+)$/);
    if (!matches) {
      return res.status(400).send('Invalid image format.');
    }
    const base64Data = matches[1];
    const buffer = Buffer.from(base64Data, 'base64');
    const filename = uuidv4()+'.png'
    try{
        fs.writeFileSync(path.join(__dirname,'Detection',filename),buffer)
        const tempimgpath = path.join(__dirname,'Detection',filename)
        console.log("here\n")
        const descriptor = await getFaceDescriptor(tempimgpath)
        const bestMatch = await findBestMatch(descriptor)
        console.log("here2\n")
        console.log(bestMatch)
        if(bestMatch._label == 'unknown'){
            fs.unlinkSync(tempimgpath)
            return res.json({'success':false,'message':'No Match Found. Try Again with Clear Photo with Plain Background and No Glasses or Mask. Also Uniform Lighting is Required.'})
        }
        const student = await Student.findById(bestMatch._label)
        // console.log(student)
        student.attendance+=1
        await student.save()
        fs.unlinkSync(tempimgpath)
        return res.json({'success':true,'message':`Attendance Marked for ${student.name}(Roll Number: ${student.roll})`})
    }
    catch(err){
        
        return res.json({'success':false,'message':'Something went wrong'})
    }
})

loadModels().then(() => {
    console.log('Models loaded');
  });


async function getStudentDescriptor(path) {
    const descriptor = await getFaceDescriptor(path);
    // console.log(descriptor)
    if(descriptor == null || !descriptor){
        return false;
    }
    // console.log(descriptor)
    return descriptor;
}

async function findBestMatch(newDescriptor) {
    if(!newDescriptor){
        return {'_label':'unknown'}
    }
    // how to take only descriptor and roll field from database
    studentDescriptors = await Student.find({}, { descriptor: 1, _id: 1 })
    // console.log(Object.values(studentDescriptors[0].descriptor[0]))

    const labeledDescriptors = studentDescriptors.map(sd => new faceapi.LabeledFaceDescriptors(`${sd._id}`, [new Float32Array(Object.values(sd.descriptor[0]))]));
    const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors);
    const bestMatch = faceMatcher.findBestMatch(newDescriptor);
    // console.log(bestMatch)
    return bestMatch;
  }

app.listen(5000)