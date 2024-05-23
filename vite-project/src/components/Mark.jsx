import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/esm/Button';
import Container from 'react-bootstrap/esm/Container'
import NotificationJS from 'notification-npm';
import '/node_modules/notification-npm/index.css';

export const Mark = () => {
    document.title = "Mark Attendance - IITK"

    const [photo, setPhoto] = useState('');
    const [stream, setStream] = useState(null);
    const [disabled, setDisabled] = useState(false);

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
        setDisabled(true);
        const notification1 = new NotificationJS({
            message: 'Please wait while we mark the attendance',
            type: 'normal',
            duration: 25000,
            theme: 'dark',
            sound: false,
            disable_timer: true,
        });
        notification1.show();
        if (photo === '') {
            const notification = new NotificationJS({
                message: 'Please take a photo',
                type: 'error',
                duration: 5000,
                theme: 'dark',
                sound: false,
                disable_timer: false,
            });
            notification.show();
            setDisabled(false);
            notification1.hide();
            return;
        }
        const res = await fetch('http://localhost:5000/markattendance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': localStorage.getItem('token')
            },
            body: JSON.stringify({ photo })
        });
        const data = await res.json();
        if(data.success){
            const notification = new NotificationJS({
                message: data.message,
                type: 'success',
                duration: 5000,
                theme: 'dark',
                sound: false,
                disable_timer: false,
            });
            notification.show();
        }
        else{
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
        notification1.hide();
        setDisabled(false);
    }

    return (
        <Container>
            <h1 style={{ 'textAlign': 'center', 'color': 'white' }}>Mark Attendance</h1>
            <div className="camerapart">
                <h3 style={{'color':'white'}}>
                    Capture the photo of the student with plain background looking straight into the camera.
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
            <Button variant="primary" disabled={disabled} style={{ 'margin': '10px' }} onClick={(e)=>submit(e)}>Mark Attendance</Button>

        </Container>
    )
}
