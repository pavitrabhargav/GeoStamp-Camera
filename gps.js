/* ==========================================
   GeoStamp Camera
   gps.js Part 1
========================================== */

let gpsWatcher = null;

const gpsText = document.getElementById("gpsText");
const accuracy = document.getElementById("accuracy");
const latitude = document.getElementById("latitude");
const longitude = document.getElementById("longitude");

const currentDate = document.getElementById("currentDate");
const currentTime = document.getElementById("currentTime");

function updateDateTime() {

    const now = new Date();

    currentDate.innerText =
        now.toLocaleDateString();

    currentTime.innerText =
        now.toLocaleTimeString();

}

setInterval(updateDateTime,1000);

updateDateTime();

/* 30/7/26===="_:rb jhh r.h ii css
ji======================================
   GPS Start
=============time_/_22:00:56========.       hy hy to the time of reading zone===================== */

function startGPS(){

    if(!navigator.geolocation){

        gpsText.innerText="GPS Not Supported";

        return;

    }

    gpsWatcher = navigator.geolocation.watchPosition(

        gpsSuccess,

        gpsError,

        {

            enableHighAccuracy:true,

            maximumAge:0,

            timeout:15000

        }

    );

}

/* ==========================================
   GPS Success
========================================== */

function gpsSuccess(position){

    const lat = position.coords.latitude;

    const lng = position.coords.longitude;

    latitude.innerText = lat.toFixed(6);

    longitude.innerText = lng.toFixed(6);

    accuracy.innerText =
        Math.round(position.coords.accuracy);

    gpsText.innerText="GPS Connected";

}

/* ==========================================
   GPS Error
========================================== */

function gpsError(error){

    console.log(error);

    gpsText.innerText="GPS Error";

}

/* ==========================================
   Init
========================================== */

window.addEventListener(

    "load",

    startGPS

);
/* ==========================================
   Reverse Geocoding
========================================== */

async function updateAddress(lat, lng) {

    try {

        const response = await fetch(

            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`

        );

        const data = await response.json();

        const address = data.address || {};

        document.getElementById("city").innerText =
            address.city ||
            address.town ||
            address.village ||
            "--";

        document.getElementById("address").innerText =
            data.display_name || "--";

    }

    catch (error) {

        console.log(error);

    }

}

/* ==========================================
   GPS Success Update
========================================== */

const oldGpsSuccess = gpsSuccess;

gpsSuccess = function(position){

    oldGpsSuccess(position);

    const lat = position.coords.latitude;

    const lng = position.coords.longitude;

    updateAddress(lat,lng);

    if(position.coords.altitude !== null){

        document.getElementById("altitude").innerText =
            position.coords.altitude.toFixed(1)+" m";

    }

    if(position.coords.speed !== null){

        document.getElementById("speed").innerText =
            (position.coords.speed*3.6).toFixed(1)+" km/h";

    }

};

/* ==========================================
   Compass
========================================== */

window.addEventListener(

    "deviceorientation",

    function(event){

        if(event.alpha==null) return;

        const degree = event.alpha;

        let dir="N";

        if(degree>=22.5 && degree<67.5) dir="NE";
        else if(degree>=67.5 && degree<112.5) dir="E";
        else if(degree>=112.5 && degree<157.5) dir="SE";
        else if(degree>=157.5 && degree<202.5) dir="S";
        else if(degree>=202.5 && degree<247.5) dir="SW";
        else if(degree>=247.5 && degree<292.5) dir="W";
        else if(degree>=292.5 && degree<337.5) dir="NW";

        document.getElementById("direction").innerText =
            dir+" ("+Math.round(degree)+"°)";

    }

);

/* ==========================================
   Stop GPS
========================================== */

function stopGPS(){

    if(gpsWatcher){

        navigator.geolocation.clearWatch(gpsWatcher);

    }

}
/* ==========================================
   GPS Accuracy Lock
========================================== */

const REQUIRED_ACCURACY = 10;

function isGpsReady() {

    const value = Number(
        document.getElementById("accuracy").innerText
    );

    if (isNaN(value)) return false;

    return value <= REQUIRED_ACCURACY;

}

function updateCaptureButton() {

    const button =
        document.getElementById("captureButton");

    if (!button) return;

    if (isGpsReady()) {

        button.disabled = false;

        button.style.opacity = "1";

        gpsText.innerText = "GPS Ready";

        document.getElementById("gpsDot").style.background =
            "#00ff00";

    } else {

        button.disabled = true;

        button.style.opacity = ".45";

        gpsText.innerText =
            "Waiting Accurate GPS...";

        document.getElementById("gpsDot").style.background =
            "#ff0000";

    }

}

/* ==========================================
   GPS Refresh
========================================== */

setInterval(

    updateCaptureButton,

    1000

);

/* ==========================================
   Get Current GPS Data
========================================== */

function getGpsData() {

    return {

        city:
            document.getElementById("city").innerText,

        address:
            document.getElementById("address").innerText,

        latitude:
            document.getElementById("latitude").innerText,

        longitude:
            document.getElementById("longitude").innerText,

        altitude:
            document.getElementById("altitude").innerText,

        speed:
            document.getElementById("speed").innerText,

        direction:
            document.getElementById("direction").innerText,

        accuracy:
            document.getElementById("accuracy").innerText,

        date:
            document.getElementById("currentDate").innerText,

        time:
            document.getElementById("currentTime").innerText

    };

}

/* ==========================================
   Export
========================================== */

window.GeoGPS = {

    startGPS,

    stopGPS,

    getGpsData,

    isGpsReady

};

console.log("gps.js Loaded Successfully");
/* ==========================================
   GPS Signal Monitor
========================================== */

let gpsSignalLevel = "Searching";

function updateGpsSignal(acc){

    if(acc <= 5){

        gpsSignalLevel = "Excellent";

    }else if(acc <= 10){

        gpsSignalLevel = "Good";

    }else if(acc <= 20){

        gpsSignalLevel = "Average";

    }else{

        gpsSignalLevel = "Weak";

    }

    console.log("GPS Signal :",gpsSignalLevel);

}

/* ==========================================
   Update Signal Every Position
========================================== */

const oldSuccess = gpsSuccess;

gpsSuccess = function(position){

    oldSuccess(position);

    updateGpsSignal(position.coords.accuracy);

};

/* ==========================================
   GPS Status Export
========================================== */

window.GeoGPS.getSignal=function(){

    return gpsSignalLevel;

};

console.log("GPS Signal Monitor Loaded");
