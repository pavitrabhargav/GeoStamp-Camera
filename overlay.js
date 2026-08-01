/* ==========================================
   GeoStamp Camera Pro
   overlay.js - Part 1
========================================== */

/* ==========================================
   Overlay Elements
========================================== */

const overlay = {

    address: document.getElementById("address"),

    latitude: document.getElementById("latitude"),

    longitude: document.getElementById("longitude"),

    accuracy: document.getElementById("accuracy"),

    currentDate: document.getElementById("currentDate"),

    currentTime: document.getElementById("currentTime"),

    liveTime: document.getElementById("liveTime")

};

/* ==========================================
   Update Mobile Date & Time
========================================== */

function updateOverlayDateTime() {

    const now = new Date();

    const date = now.toLocaleDateString("en-GB");

    const time = now.toLocaleTimeString("en-IN", {

        hour12: false

    });

    overlay.currentDate.textContent = date;

    overlay.currentTime.textContent = time;

    overlay.liveTime.textContent = time;

}

/* ==========================================
   Refresh Every Second
========================================== */

setInterval(updateOverlayDateTime, 1000);

updateOverlayDateTime();

/* ==========================================
   Get Overlay Data
========================================== */

function getOverlayData() {

    return {

        address: overlay.address.textContent,

        latitude: overlay.latitude.textContent,

        longitude: overlay.longitude.textContent,

        accuracy: overlay.accuracy.textContent,

        date: overlay.currentDate.textContent,

        time: overlay.currentTime.textContent

    };

}
/* ==========================================
   GeoStamp Camera Pro
   overlay.js - Part 2
========================================== */

/* ==========================================
   Draw Professional Overlay
========================================== */

function drawPhotoOverlay(ctx, canvas) {

    const data = getOverlayData();

    const margin = 25;
    const boxHeight = 240;
    const radius = 18;

    const boxX = margin;
    const boxY = canvas.height - boxHeight - margin;
    const boxWidth = canvas.width - (margin * 2);

    /* Background */

    ctx.save();

    ctx.fillStyle = "rgba(0,0,0,0.65)";

    drawRoundedRect(
        ctx,
        boxX,
        boxY,
        boxWidth,
        boxHeight,
        radius
    );

    /* Title */

    ctx.fillStyle = "#FFD54F";
    ctx.font = "bold 34px Arial";

    ctx.fillText(
        "GeoStamp Camera",
        boxX + 25,
        boxY + 45
    );

    /* Information */

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "24px Arial";

    let lineY = boxY + 85;

    ctx.fillText(
        "Address : " + data.address,
        boxX + 25,
        lineY
    );

    lineY += 35;

    ctx.fillText(
        "Latitude : " + data.latitude,
        boxX + 25,
        lineY
    );

    lineY += 35;

    ctx.fillText(
        "Longitude : " + data.longitude,
        boxX + 25,
        lineY
    );

    lineY += 35;

    ctx.fillText(
        "Accuracy : " + data.accuracy,
        boxX + 25,
        lineY
    );

    lineY += 35;

    ctx.fillText(
        "Date : " + data.date,
        boxX + 25,
        lineY
    );

    lineY += 35;

    ctx.fillText(
        "Time : " + data.time,
        boxX + 25,
        lineY
    );

    ctx.restore();

}

/* ==========================================
   Rounded Rectangle
========================================== */

function drawRoundedRect(
    ctx,
    x,
    y,
    width,
    height,
    radius
) {

    ctx.beginPath();

    ctx.moveTo(x + radius, y);

    ctx.arcTo(
        x + width,
        y,
        x + width,
        y + height,
        radius
    );

    ctx.arcTo(
        x + width,
        y + height,
        x,
        y + height,
        radius
    );

    ctx.arcTo(
        x,
        y + height,
        x,
        y,
        radius
    );

    ctx.arcTo(
        x,
        y,
        x + width,
        y,
        radius
    );

    ctx.closePath();

    ctx.fill();

}
/* ==========================================
   GeoStamp Camera Pro
   overlay.js - Part 3
========================================== */

/* ==========================================
   Draw Logo
========================================== */

function drawLogo(ctx, canvas) {

    ctx.save();

    ctx.fillStyle = "#2196F3";

    ctx.beginPath();
    ctx.arc(45,45,22,0,Math.PI*2);
    ctx.fill();

    ctx.fillStyle="#FFFFFF";
    ctx.font="bold 18px Arial";
    ctx.fillText("G",39,51);

    ctx.fillStyle="#FFFFFF";
    ctx.font="bold 24px Arial";

    ctx.fillText(
        "GeoStamp Camera Pro",
        75,
        52
    );

    ctx.restore();

}

/* ==========================================
   Draw Watermark
========================================== */

function drawWatermark(ctx,canvas){

    ctx.save();

    ctx.fillStyle="rgba(255,255,255,0.85)";
    ctx.font="18px Arial";

    ctx.textAlign="right";

    ctx.fillText(

        "Captured by GeoStamp Camera",

        canvas.width-25,

        canvas.height-20

    );

    ctx.restore();

}

/* ==========================================
   Draw Compass
========================================== */

function drawCompass(ctx){

    ctx.save();

    ctx.fillStyle="#FF3D00";

    ctx.beginPath();

    ctx.arc(60,110,18,0,Math.PI*2);

    ctx.fill();

    ctx.fillStyle="#FFFFFF";

    ctx.font="bold 18px Arial";

    ctx.textAlign="center";

    ctx.fillText("N",60,116);

    ctx.restore();

}

/* ==========================================
   Main Overlay Renderer
========================================== */

function renderOverlay(ctx,canvas){

    drawLogo(ctx,canvas);

    drawCompass(ctx);

    drawPhotoOverlay(ctx,canvas);

    drawWatermark(ctx,canvas);

}
