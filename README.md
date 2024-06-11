# Attendance App

A MERN stack web app which can be used for Attendance marking using Face recognition.
face-api.js has been implemented for face recognition.

### Intructions to run the code locally:
1. Clone the repository using
```console
git clone https://github.com/Shlok-Jain/pclub_task6
```
2. cd in the repository
```console
cd ./pclub_task6
```
3. cd in backend
```console
cd ./backend
```
4. Install libraries
```console
npm install
```
5. Run backend (make sure localhost port 5000 is free)
```console
node index.js
```
6. Open a new terminal for frontend and cd in frontend folder
```console
cd ./pclub_task6/vite-project
```
7. Install libraries
```console
npm install
```
8. Run frontend
```console
npm run dev
```
9. Go to link mentioned in terminal to access webapp.

### How to use
- Go to student login page, enter roll no and password to get your attendance
- To add new student: Login on admin login page(password: admin123) then click "Add student". Allow camera access, enter details, click photo using "Take photo" button, and submit.
- Mark attendance: login in admin panel, click on "Mark attendance", click "take photo" and submit


### Frontend endpoints:
- `/` : Home page
- `/student` : For students to see their attendance history
- `/admin` : For admin login
- `/adminpanel` : To see all students' attendance history
- `/addstudent` : Registering new students
- `/mark` : Marking attendance (it will take some time, please be patient...)

### Backend endpoints:
- `/student(POST)` : returns attendance history by taking roll no. and password of specific student.
- `/addstudent(POST)` : Registeres a student in database.
- `/adminlogin(POST)` : Admin authentication
- `/getstudentsattendance(POST)` : returns attendance history of all students
- `/markattendance(POST)` : Marks attendance of student, taking this photo

The MongoDB database used here has been deleted so you will have to create your own database and add its URI to db.js file.
