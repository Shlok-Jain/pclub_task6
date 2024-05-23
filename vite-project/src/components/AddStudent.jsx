import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/esm/Container';
import NotificationJS from 'notification-npm';
import '/node_modules/notification-npm/index.css';

export const AddStudent = () => {
    document.title = "Add Student - IITK"
    const [roll, setRoll] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [photo, setPhoto] = useState('');
    const [stream, setStream] = useState(null);

    useEffect(() => {
        const width = 320;
        let height = 0;
        let streaming = false;
        let video = null;
        let canvas = null;
        let photoElement = null;
        let startbutton = null;

        function showViewLiveResultButton() {
            if (window.self !== window.top) {
                document.querySelector(".contentarea").remove();
                const button = document.createElement("button");
                button.textContent = "View live result of the example code above";
                document.body.append(button);
                button.addEventListener("click", () => window.open(location.href));
                return true;
            }
            return false;
        }

        function startup() {
            if (showViewLiveResultButton()) {
                return;
            }
            video = document.getElementById("video");
            canvas = document.getElementById("canvas");
            photoElement = document.getElementById("photo");
            startbutton = document.getElementById("startbutton");

            navigator.mediaDevices
                .getUserMedia({ video: true, audio: false })
                .then((stream) => {
                    video.srcObject = stream;
                    video.play();
                    setStream(stream); // Store the stream in state
                })
                .catch((err) => {
                    const notification = new NotificationJS({
                        message: 'Please allow camera access',
                        type: 'error',
                        duration: 5000,
                        theme: 'dark',
                        sound: false,
                        disable_timer: false,
                    });
                    notification.show();
                });

            video.addEventListener(
                "canplay",
                (ev) => {
                    if (!streaming) {
                        height = video.videoHeight / (video.videoWidth / width);
                        if (isNaN(height)) {
                            height = width / (4 / 3);
                        }
                        video.setAttribute("width", width);
                        video.setAttribute("height", height);
                        canvas.setAttribute("width", width);
                        canvas.setAttribute("height", height);
                        streaming = true;
                    }
                },
                false
            );

            startbutton.addEventListener(
                "click",
                (ev) => {
                    ev.preventDefault();
                    takepicture();
                },
                false
            );

            clearphoto();
        }

        function clearphoto() {
            const context = canvas.getContext("2d");
            context.fillStyle = "#AAA";
            context.fillRect(0, 0, canvas.width, canvas.height);

            const data = canvas.toDataURL("image/png");
            photoElement.setAttribute("src", data);
        }

        function takepicture() {
            const context = canvas.getContext("2d");
            if (width && height) {
                canvas.width = width;
                canvas.height = height;
                context.drawImage(video, 0, 0, width, height);

                const data = canvas.toDataURL("image/png");
                photoElement.setAttribute("src", data);
                setPhoto(data);
            } else {
                clearphoto();
            }
        }

        window.addEventListener("load", startup, false);

        return () => {
            // Cleanup function to stop the camera
            if (stream) {
                stream.getTracks().forEach((track) => {
                    track.stop();
                });
            }
            window.removeEventListener("load", startup);
        };
    }, [stream]);

    const submit = async (e) => {
        e.preventDefault();
        const notification1 = new NotificationJS({
            message: 'Please wait while we add the student',
            type: 'normal',
            duration: 35000,
            theme: 'dark',
            sound: false,
            disable_timer: true,
        });
        notification1.show();
        if (roll === '' || name === '' || password === '' || photo === '') {
            const notification = new NotificationJS({
                message: 'Please fill all the fields',
                type: 'error',
                duration: 5000,
                theme: 'dark',
                sound: false,
                disable_timer: false,
            });
            notification.show();
            notification1.hide();
            return;
        }
        await fetch('http://localhost:5000/addstudent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': localStorage.getItem('token')
            },
            body: JSON.stringify({ roll: roll, name: name, password: password, photo: photo }),
        }).then(async (res) => await res.json()).then((data) => {
            console.log(data.message);
            if (data.success) {
                const notification = new NotificationJS({
                    message: data.message,
                    type: 'success',
                    duration: 5000,
                    theme: 'dark',
                    sound: false,
                    disable_timer: false,
                });
                notification.show();
            } else {
                const notification = new NotificationJS({
                    message: data.message,
                    type: 'error',
                    duration: 5000,
                    theme: 'dark',
                    sound: false,
                    disable_timer: false,
                });
                notification.show();
            }
        });
        notification1.hide();
    };

    //TODO: create backend endpoint to add student and call it here

    return (
        <Container className='studform'>
            <h3 style={{ textAlign: "center" }}>Add Student</h3>
            <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Roll Number</Form.Label>
                    <Form.Control type="number" onChange={(e) => setRoll(e.target.value)} placeholder="Enter Roll No." />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" onChange={(e) => setName(e.target.value)} placeholder="Enter Name" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                </Form.Group>
                <div className="camerapart">
                    <h3>
                        Capture the photo of the student with plain background and looking straight into the camera.
                    </h3>
                    <div className="camera">
                        <video id="video">Video stream not available.</video>
                    </div>
                    <button id="startbutton">Take photo</button>
                    <canvas id="canvas" style={{ display: 'none' }}> </canvas>
                    <h4>Preview:</h4>
                    <div className="output">
                        <img id="photo" alt="Preview will show here" />
                    </div>
                </div>

                <Button variant="primary" onClick={(e) => submit(e)} type="submit" style={{ margin: '20px' }}>
                    Submit
                </Button>
            </Form>
        </Container>
    );
};
