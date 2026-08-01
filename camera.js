/* ==========================================
   GeoStamp Camera Pro
   camera.js - Part 1
========================================== */

const video = document.getElementById("camera");
const canvas = document.getElementById("photoCanvas");
const ctx = canvas.getContext("2d", {
    willReadFrequently: true
});

let currentStream = null;
let facingMode = "environment";
let flashEnabled = false;

/* ==========================================
   Start Camera
========================================== */

async function startCamera() {

    try {

        stopCamera();

        updateStatus("Opening Camera...");

        currentStream = await navigator.mediaDevices.getUserMedia({

            video: {

                facingMode: facingMode,

                width: {
                    ideal: 1920
                },

                height: {
                    ideal: 1080
                }

            },

            audio: false

        });

        video.srcObject = currentStream;

        await video.play();

        hideLoading();

        showApp();

        updateStatus("Camera Ready");

    }

    catch (error) {

        console.error(error);

        updateStatus("Camera Permission Denied");

        alert("Camera permission is required.");

    }

}

/* ==========================================
   Stop Camera
========================================== */

function stopCamera() {

    if (!currentStream) return;

    currentStream.getTracks().forEach(track => {

        track.stop();

    });

}

/* ==========================================
   Switch Camera
========================================== */

async function switchCamera() {

    if (facingMode === "environment") {

        facingMode = "user";

    } else {

        facingMode = "environment";

    }

    await startCamera();

}

/* ==========================================
   Helpers
========================================== */

function showApp() {

    document
        .getElementById("app")
        .classList
        .remove("hidden");

}

function hideLoading() {

    document
        .getElementById("loadingScreen")
        .classList
        .add("hidden");

}

function updateStatus(text) {

    document
        .getElementById("statusMessage")
        .textContent = text;

}
/* ==========================================
   Photo Capture
========================================== */

async function capturePhoto() {

    try {

        updateStatus("Capturing...");

        if (video.videoWidth === 0) {
            alert("Camera is not ready.");
            return;
        }

        /* Canvas Size */

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        /* Draw Camera Frame */

        ctx.drawImage(
            video,
            0,
            0,
            canvas.width,
            canvas.height
        );

        /* Draw Overlay */

        drawOverlay();

        /* Shutter Sound */

        const shutter = document.getElementById("shutterSound");

        if (shutter) {

            shutter.currentTime = 0;

            shutter.play().catch(() => {});

        }

        /* Preview */

        const image = canvas.toDataURL(
            "image/jpeg",
            1.0
        );

        document.getElementById(
            "capturedImage"
        ).src = image;

        document.getElementById(
            "photoPreview"
        ).classList.remove("hidden");

        updateStatus("Photo Captured");

    }

    catch (err) {

        console.error(err);

        updateStatus("Capture Failed");

    }

}

/* ==========================================
   Save Photo
========================================== */

function savePhoto() {

    const link = document.createElement("a");

    link.download =
        "GeoStamp_" +
        Date.now() +
        ".jpg";

    link.href = canvas.toDataURL(
        "image/jpeg",
        1.0
    );

    link.click();

}

/* ==========================================
   Retake Photo
========================================== */

function retakePhoto() {

    document
        .getElementById("photoPreview")
        .classList
        .add("hidden");

    updateStatus("Camera Ready");

}

/* ==========================================
   Button Events
========================================== */

window.addEventListener("DOMContentLoaded", () => {

    document.getElementById("captureBtn")
        .addEventListener("click", capturePhoto);

    document.getElementById("downloadBtn")
        .addEventListener("click", savePhoto);

    document.getElementById("retakeBtn")
        .addEventListener("click", retakePhoto);

    document.getElementById("switchBtn")
        .addEventListener("click", switchCamera);

    document.getElementById("flashBtn")
        .addEventListener("click", toggleFlash);

});
/* ==========================================
   Draw Overlay on Photo
========================================== */

function drawOverlay() {

    const padding = 30;
    const boxHeight = 260;

    /* Background */

    ctx.fillStyle = "rgba(0,0,0,0.60)";
    roundRect(
        ctx,
        20,
        canvas.height - boxHeight - 20,
        canvas.width - 40,
        boxHeight,
        20
    );

    /* Text */

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 34px Arial";

    let x = padding + 20;
    let y = canvas.height - boxHeight + 35;

    ctx.fillText("GeoStamp Camera", x, y);

    ctx.font = "26px Arial";

    y += 45;
    ctx.fillText(
        "Address : " +
        document.getElementById("address").textContent,
        x,
        y
    );

    y += 40;
    ctx.fillText(
        "Latitude : " +
        document.getElementById("latitude").textContent,
        x,
        y
    );

    y += 40;
    ctx.fillText(
        "Longitude : " +
        document.getElementById("longitude").textContent,
        x,
        y
    );

    y += 40;
    ctx.fillText(
        "Date : " +
        document.getElementById("currentDate").textContent,
        x,
        y
    );

    y += 40;
    ctx.fillText(
        "Time : " +
        document.getElementById("currentTime").textContent,
        x,
        y
    );

}

/* ==========================================
   Rounded Rectangle
========================================== */

function roundRect(ctx, x, y, width, height, radius) {

    ctx.beginPath();

    ctx.moveTo(x + radius, y);

    ctx.arcTo(x + width, y, x + width, y + height, radius);

    ctx.arcTo(x + width, y + height, x, y + height, radius);

    ctx.arcTo(x, y + height, x, y, radius);

    ctx.arcTo(x, y, x + width, y, radius);

    ctx.closePath();

    ctx.fill();

}

/* ==========================================
   Flash (Browser Support)
========================================== */

async function toggleFlash() {

    if (!currentStream) return;

    const track = currentStream.getVideoTracks()[0];

    if (!track) return;

    const capabilities = track.getCapabilities();

    if (!capabilities.torch) {

        alert("Flash/Torch is not supported on this device.");

        return;

    }

    flashEnabled = !flashEnabled;

    await track.applyConstraints({

        advanced: [

            {
                torch: flashEnabled
            }

        ]

    });

}

/* ==========================================
   Flash Button
========================================== */

document
.getElementById("flashBtn")
.addEventListener(
"click",
toggleFlash
);

/* ==========================================
   Auto Start
========================================== */

window.addEventListener("load", () => {

    startCamera();

});
