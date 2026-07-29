const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const captureBtn = document.getElementById("captureBtn");
const switchBtn = document.getElementById("switchBtn");
const downloadBtn = document.getElementById("downloadBtn");

let currentStream;
let facingMode = "environment";

let latitude = "";
let longitude = "";
let address = "";


// CAMERA START
async function startCamera(){

    if(currentStream){
        currentStream.getTracks().forEach(track => track.stop());
    }

    try{

        const stream = await navigator.mediaDevices.getUserMedia({

            video:{
                facingMode:facingMode,
                width:{ideal:1920},
                height:{ideal:1080}
            },

            audio:false

        });

        currentStream = stream;
        video.srcObject = stream;

    }
    catch(error){

        alert("Camera permission allow करें");

        console.log(error);
    }

}

startCamera();


// SWITCH CAMERA

switchBtn.onclick = function(){

    if(facingMode==="environment"){
        facingMode="user";
    }
    else{
        facingMode="environment";
    }

    startCamera();

};


// GET LOCATION

function getLocation(){

    if(navigator.geolocation){

        navigator.geolocation.getCurrentPosition(

            async function(position){

                latitude = position.coords.latitude.toFixed(6);
                longitude = position.coords.longitude.toFixed(6);


                try{

                    let response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    );


                    let data = await response.json();

                    address = data.display_name;

                }
                catch(e){

                    address="Location not found";

                }


            },


            function(){

                address="GPS Permission Denied";

            },


            {
                enableHighAccuracy:true
            }

        );


    }

}


getLocation();


// CAPTURE PHOTO


captureBtn.onclick=function(){


    if(video.videoWidth===0){

        alert("Camera loading...");
        return;

    }


    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;


    // PHOTO DRAW

    ctx.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
    );



    // BLACK TRANSPARENT BOX

    ctx.fillStyle="rgba(0,0,0,0.55)";

    ctx.fillRect(
        20,
        canvas.height-230,
        canvas.width-40,
        200
    );



    // TEXT STYLE

    ctx.fillStyle="white";

    ctx.font="bold 35px Arial";



    let now = new Date();


    let date =
    now.toLocaleDateString("en-IN");


    let time =
    now.toLocaleTimeString("en-IN");



    ctx.fillText(
        "📍 "+address,
        40,
        canvas.height-170
    );


    ctx.fillText(
        "Lat: "+latitude+"  Lon: "+longitude,
        40,
        canvas.height-120
    );


    ctx.fillText(
        "Date: "+date+"  Time: "+time,
        40,
        canvas.height-70
    );



    downloadBtn.style.display="block";


};


// DOWNLOAD PHOTO


downloadBtn.onclick=function(){


    let link=document.createElement("a");

    link.download="GeoStamp_Photo_"+Date.now()+".png";

    link.href=canvas.toDataURL("image/png");


    link.click();


};
