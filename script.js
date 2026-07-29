const video = document.getElementById("camera");

const placeName = document.getElementById("placeName");
const address = document.getElementById("address");
const latText = document.getElementById("lat");
const lngText = document.getElementById("lng");
const dateTime = document.getElementById("dateTime");

const canvas = document.getElementById("canvas");
const captureBtn = document.getElementById("captureBtn");
const result = document.getElementById("result");


let latitude = "";
let longitude = "";
let place = "";
let fullAddress = "";

let map;
let marker;



// =====================
// CAMERA START
// =====================

async function startCamera(){

try{

const stream = await navigator.mediaDevices.getUserMedia({

video:{
facingMode:"environment"
},

audio:false

});


video.srcObject = stream;


}

catch(error){

alert("Camera Permission Denied");

console.log(error);

}

}



// =====================
// DATE TIME
// =====================

function updateDateTime(){

const now = new Date();

dateTime.innerHTML =
now.toLocaleDateString()+
"<br>"+
now.toLocaleTimeString();

}


setInterval(updateDateTime,1000);

updateDateTime();




// =====================
// GPS
// =====================


navigator.geolocation.getCurrentPosition(

(position)=>{


latitude = position.coords.latitude;

longitude = position.coords.longitude;


latText.innerHTML =
"Latitude : "+latitude.toFixed(6);


lngText.innerHTML =
"Longitude : "+longitude.toFixed(6);



loadMap(latitude,longitude);


getAddress(latitude,longitude);



},


(error)=>{

alert("GPS Permission Denied");

}

);




// =====================
// MAP
// =====================

function loadMap(lat,lng){


map = L.map('map').setView([lat,lng],17);



L.tileLayer(

'https://tile.openstreetmap.org/{z}/{x}/{y}.png',

{

maxZoom:19

}

).addTo(map);



marker = L.marker([lat,lng]).addTo(map);



}



// =====================
// ADDRESS
// =====================


async function getAddress(lat,lng){


try{


const url =

`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;



const response = await fetch(url);


const data = await response.json();



place =

data.address.village ||

data.address.town ||

data.address.city ||

"Unknown";



fullAddress = data.display_name;



placeName.innerHTML = place;


address.innerHTML = fullAddress;



}

catch(e){

console.log(e);

}


}



// =====================
// CAPTURE PHOTO
// =====================


captureBtn.onclick = function(){


if(video.readyState < 2){

alert("Camera Loading...");

return;

}



canvas.width = video.videoWidth;

canvas.height = video.videoHeight;



const ctx = canvas.getContext("2d");



// Camera Image

ctx.drawImage(

video,

0,

0,

canvas.width,

canvas.height

);



// GPS STAMP BOX


ctx.fillStyle="rgba(0,0,0,0.6)";

ctx.fillRect(

20,

canvas.height-170,

canvas.width-40,

140

);



ctx.fillStyle="white";

ctx.font="22px Arial";



ctx.fillText(

"📍 "+place,

40,

canvas.height-130

);



ctx.font="16px Arial";


ctx.fillText(

"Lat: "+latitude.toFixed(6),

40,

canvas.height-95

);



ctx.fillText(

"Lng: "+longitude.toFixed(6),

40,

canvas.height-70

);



ctx.fillText(

new Date().toLocaleString(),

40,

canvas.height-45

);



// SHOW IMAGE


const image = canvas.toDataURL("image/png");


result.src=image;

result.style.display="block";



// DOWNLOAD


const link=document.createElement("a");

link.download="GeoStamp_Photo.png";

link.href=image;

link.click();


};



// START CAMERA

startCamera();
