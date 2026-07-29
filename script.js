const video = document.getElementById("camera");
const placeName = document.getElementById("placeName");
const address = document.getElementById("address");
const latText = document.getElementById("lat");
const lngText = document.getElementById("lng");
const dateTime = document.getElementById("dateTime");

let map;
let marker;

// Camera Start
async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: "environment"
            },
            audio: false
        });

        video.srcObject = stream;

    } catch (e) {
        alert("Camera Permission Denied");
        console.log(e);
    }
}

// Date Time
function updateDateTime() {

    const now = new Date();

    dateTime.innerHTML =
        now.toLocaleDateString() +
        "<br>" +
        now.toLocaleTimeString();

}

setInterval(updateDateTime,1000);

// GPS

navigator.geolocation.getCurrentPosition(

function(position){

const lat = position.coords.latitude;
const lng = position.coords.longitude;

latText.innerHTML="Latitude : "+lat.toFixed(6);

lngText.innerHTML="Longitude : "+lng.toFixed(6);

loadMap(lat,lng);

getAddress(lat,lng);

},

function(){

alert("GPS Permission Denied");

}

);

// Map

function loadMap(lat,lng){

map = L.map('map').setView([lat,lng],17);

L.tileLayer(

'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',

{

maxZoom:19

}

).addTo(map);

marker=L.marker([lat,lng]).addTo(map);

}

// Address

async function getAddress(lat,lng){

const url=`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;

const res=await fetch(url);

const data=await res.json();

placeName.innerHTML=data.address.village || data.address.town || data.address.city || "Unknown";

address.innerHTML=data.display_name;

}

startCamera();

updateDateTime();
// =============================
// Capture Photo
// =============================

const canvas = document.getElementById("canvas");
const captureBtn = document.getElementById("captureBtn");
const result = document.getElementById("result");

captureBtn.addEventListener("click", capturePhoto);

function capturePhoto(){

const ctx = canvas.getContext("2d");

canvas.width = video.videoWidth;
canvas.height = video.videoHeight;

ctx.drawImage(
video,
0,
0,
canvas.width,
canvas.height
);

const img = canvas.toDataURL("image/png");

result.src = img;

result.style.display = "block";

downloadImage(img);

}

function downloadImage(img){

const a = document.createElement("a");

a.href = img;

a.download =
"GeoStamp_" +
Date.now() +
".png";

a.click();

}
