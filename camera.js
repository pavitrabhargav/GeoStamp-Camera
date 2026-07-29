/* ==========================================
   GeoStamp Camera
   camera.js
========================================== */

let cameraStream = null;
let currentFacingMode = "environment";

const video = document.getElementById("camera");
const canvas = document.getElementById("photoCanvas");

const captureButton = document.getElementById("captureButton");
const switchButton = document.getElementById("switchCamera");

const captureIcon = document.getElementById("captureIcon");

async function startCamera() {

    try {

        if (cameraStream) {

            stopCamera();

        }

        const constraints = {

            audio: false,

            video: {

                facingMode: currentFacingMode,

                width: {
                    ideal: 1920
                },

                height: {
                    ideal: 1080
                }

            }

        };

        cameraStream =
            await navigator.mediaDevices.getUserMedia(
                constraints
            );

        video.srcObject = cameraStream;

        await video.play();

        console.log("Camera Started");

    } catch (error) {

        console.error(error);

        alert("Camera Permission Required");

    }

}

function stopCamera() {

    if (!cameraStream) return;

    cameraStream
        .getTracks()
        .forEach(track => {

            track.stop();

        });

    cameraStream = null;

}

async function switchCamera() {

    if (currentFacingMode === "environment") {

        currentFacingMode = "user";

    } else {

        currentFacingMode = "environment";

    }

    await startCamera();

}

switchButton.addEventListener(

    "click",

    switchCamera

);
/* ==========================================
   Photo Capture
========================================== */

async function capturePhoto() {

    if (!cameraStream) {
        alert("Camera not started");
        return;
    }

    if (video.readyState !== 4) {
        alert("Camera is still loading...");
        return;
    }

    const width = video.videoWidth;
    const height = video.videoHeight;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");

    // Draw camera frame
    ctx.drawImage(video, 0, 0, width, height);

    // Flash Animation
    flashScreen();

    // Prepare GPS Data
    const gpsData = {
        city: document.getElementById("city").textContent,
        address: document.getElementById("address").textContent,
        latitude: document.getElementById("latitude").textContent,
        longitude: document.getElementById("longitude").textContent,
        date: document.getElementById("currentDate").textContent,
        time: document.getElementById("currentTime").textContent,
        altitude: document.getElementById("altitude").textContent,
        speed: document.getElementById("speed").textContent,
        direction: document.getElementById("direction").textContent,
        accuracy: document.getElementById("accuracy").textContent
    };

    // Draw Overlay
    await drawOverlay(canvas, canvas, gpsData);

    savePhoto();

}

/* ==========================================
   Save Image
========================================== */

function savePhoto() {

    canvas.toBlob(function(blob){

        const link = document.createElement("a");

        const fileName =
            "GeoStamp_" +
            Date.now() +
            ".jpg";

        link.href = URL.createObjectURL(blob);

        link.download = fileName;

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(link.href);

    }, "image/jpeg", 0.98);

}

/* ==========================================
   Flash Effect
========================================== */

function flashScreen(){

    const flash = document.createElement("div");

    flash.style.position="fixed";
    flash.style.left="0";
    flash.style.top="0";
    flash.style.width="100%";
    flash.style.height="100%";
    flash.style.background="#ffffff";
    flash.style.opacity="
/* ==========================================
   Camera Zoom & Torch
========================================== */

let currentZoom = 1;
let torchEnabled = false;

async function getVideoTrack() {

    if (!cameraStream) return null;

    const tracks = cameraStream.getVideoTracks();

    if (!tracks.length) return null;

    return tracks[0];

}

/* ==========================================
   Zoom
========================================== */

async function setZoom(value) {

    const track = await getVideoTrack();

    if (!track) return;

    const capabilities = track.getCapabilities();

    if (!capabilities.zoom) {

        console.log("Zoom not supported");

        return;

    }

    currentZoom = value;

    try {

        await track.applyConstraints({

            advanced: [

                {

                    zoom: value

                }

            ]

        });

    }

    catch (e) {

        console.log(e);

    }

}

/* ==========================================
   Torch
========================================== */

async function toggleTorch() {

    const track = await getVideoTrack();

    if (!track) return;

    const capabilities = track.getCapabilities();

    if (!capabilities.torch) {

        alert("Torch Not Supported");

        return;

    }

    torchEnabled = !torchEnabled;

    try {

        await track.applyConstraints({

            advanced: [

                {

                    torch: torchEnabled

                }

            ]

        });

    }

    catch (error) {

        console.log(error);

    }

}

/* ==========================================
   Camera Restart
========================================== */

async function restartCamera() {

    stopCamera();

    await startCamera();

}

/* ==========================================
   Error Recovery
========================================== */

video.addEventListener(

    "error",

    async () => {

        console.log("Restarting Camera...");

        await restartCamera();

    }

);

/* ==========================================
   Visibility
========================================== */

document.addEventListener(

    "visibilitychange",

    async () => {

        if (document.hidden) {

            stopCamera();

        }

        else {

            await startCamera();

        }

    }

);

/* ==========================================
   Window Focus
========================================== */

window.addEventListener(

    "focus",

    async () => {

        if (!cameraStream) {

            await startCamera();

        }

    }

);

/* ==========================================
   Camera Ready
========================================== */

video.addEventListener(

    "loadedmetadata",

    () => {

        console.log(

            "Resolution :",

            video.videoWidth,

            "x",

            video.videoHeight

        );

    }

);
/* ==========================================
   GeoStamp Camera
   camera.js Part 4
========================================== */

/* ---------- Camera Permission ---------- */

async function checkCameraPermission() {

    try {

        const permission = await navigator.permissions.query({
            name: "camera"
        });

        console.log("Camera Permission :", permission.state);

    } catch (e) {

        console.log("Permission API Not Supported");

    }

}

/* ---------- Auto Focus ---------- */

async function enableAutoFocus() {

    const track = await getVideoTrack();

    if (!track) return;

    const capabilities = track.getCapabilities();

    if (!capabilities.focusMode) {

        console.log("Auto Focus Not Supported");

        return;

    }

    try {

        await track.applyConstraints({

            advanced: [

                {

                    focusMode: "continuous"

                }

            ]

        });

    } catch (err) {

        console.log(err);

    }

}

/* ---------- GPS Lock ---------- */

function canCapturePhoto() {

    const gps = document.getElementById("gpsText");

    if (!gps) return false;

    if (gps.innerText.toLowerCase().includes("waiting")) {

        alert("Waiting for Accurate GPS...");

        return false;

    }

    return true;

}

/* ---------- Capture Button ---------- */

captureButton.addEventListener(

    "click",

    async () => {

        if (!canCapturePhoto()) return;

        captureButton.disabled = true;

        captureButton.style.opacity = ".6";

        try {

            await capturePhoto();

        }

        finally {

            captureButton.disabled = false;

            captureButton.style.opacity = "1";

        }

    }

);

/* ---------- Cleanup ---------- */

window.addEventListener(

    "beforeunload",

    () => {

        stopCamera();

    }

);

/* ---------- Initialization ---------- */

async function initializeCamera() {

    await checkCameraPermission();

    await startCamera();

    await enableAutoFocus();

    console.log("GeoStamp Camera Ready");

}

window.addEventListener(

    "load",

    initializeCamera

);

/* ---------- Export ---------- */

window.GeoStampCamera = {

    startCamera,

    stopCamera,

    switchCamera,

    capturePhoto,

    restartCamera,

    toggleTorch,

    setZoom

};

console.log("camera.js Loaded Successfully");


