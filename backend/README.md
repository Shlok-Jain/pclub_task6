# Attendance App

I have developed a MERN stack app for this task. Following are the endpoints that I have created for using the app. I have run the build command for frontend and added the build files in the backend part, but if you want to see raw original frontend code it is available [here](https://github.com/Shlok-Jain/pclub_task6_frontend).

I tried to host the website on AWS EC2 instance [http://51.20.7.73:5000/](http://51.20.7.73:5000/). But I don't know why the browser is redirecting all HTTP requests into HTTPS requests and because of this the UI is not able to make POST requests (however they are wokring when I tried them in postman) because of this automatic conversion form HTTP to HTTPS i am getting `net::ERR_SSL_PROTOCOL_ERROR`. I don't know why even after specially mentioning HTTP in url of fetch request it is requesting to HTTPS but only because of this the above link might render frontend, but it is not able to make POST requests. Steps to run it locally are given below.

I have used JSON web token to authenticate admin using authtoken stored in localStorage, so that they don't have to login repeteadly. The database used to store student details is MongoDB.

Moreover for showing notifications in the webapp I have a used the [NotificationJS](https://shlok-jain.github.io/Notification-library/) library (which is created by me, you can have a look at it 😎). (PS: if the webcam pages stop working at some point, please reload the page)

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
- `/adminlogin(POST)` : Admin authentication (password: admin123)
- `/getstudentsattendance(POST)` : returns attendance history of all students
- `/markattendance(POST)` : Marks attendance of student, taking this photo

### Intructions to run the code locally:
1. Clone the repository using
```console
git clone https://github.com/Shlok-Jain/pclub_task6
```
2. Install libraries
```console
npm install
```
3. Run final command
```console
node index.js
```