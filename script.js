const video = document.getElementById("camera");
const dateText = document.getElementById("date");
const timeText = document.getElementById("time");
const locationText = document.getElementById("location");
const latlngText = document.getElementById("latlng");

// Camera Start
async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
      audio: false
    });

    video.srcObject = stream;
  } catch (e) {
    alert("Camera Permission Required");
  }
}

// GPS Start
function getLocation() {
  if (!navigator.geolocation) {
    locationText.innerText = "GPS Not Supported";
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude.toFixed(6);
      const lon = pos.coords.longitude.toFixed(6);

      latlngText.innerText =
        "Lat : " + lat + " | Long : " + lon;

      locationText.innerText = "GPS Connected";
    },
    () => {
      locationText.innerText = "Location Permission Denied";
    }
  );
}

// Date Time
function updateTime() {
  const now = new Date();

  dateText.innerText = "Date : " + now.toLocaleDateString();

  timeText.innerText = "Time : " + now.toLocaleTimeString();
}

startCamera();
getLocation();
updateTime();

setInterval(updateTime,1000);
