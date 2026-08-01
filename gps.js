/* ==========================================
   GeoStamp Camera Pro
   gps.js - Part 1
========================================== */

// GPS Variables

let gpsWatcher = null;

let currentLatitude = "";

let currentLongitude = "";

let currentAccuracy = "";

let currentAddress = "Fetching location...";


/* ==========================================
   Start GPS
========================================== */

function startGPS() {

    if (!navigator.geolocation) {

        updateStatus("GPS Not Supported");

        return;

    }

    updateStatus("Searching GPS...");

    gpsWatcher = navigator.geolocation.watchPosition(

        handleLocationSuccess,

        handleLocationError,

        {

            enableHighAccuracy: true,

            timeout: 15000,

            maximumAge: 1000

        }

    );

}


/* ==========================================
   GPS Success
========================================== */

async function handleLocationSuccess(position) {

    currentLatitude =
        position.coords.latitude.toFixed(6);

    currentLongitude =
        position.coords.longitude.toFixed(6);

    currentAccuracy =
        Math.round(position.coords.accuracy);

    document.getElementById("latitude").textContent =
        currentLatitude;

    document.getElementById("longitude").textContent =
        currentLongitude;

    document.getElementById("accuracy").textContent =
        currentAccuracy + " m";

    updateStatus("GPS Connected");

    await reverseGeocode(
        currentLatitude,
        currentLongitude
    );

}


/* ==========================================
   GPS Error
========================================== */

function handleLocationError(error) {

    console.error(error);

    updateStatus("GPS Failed");

    document.getElementById("address").textContent =
        "Location unavailable";

}


/* ==========================================
   Stop GPS
========================================== */

function stopGPS() {

    if (gpsWatcher !== null) {

        navigator.geolocation.clearWatch(gpsWatcher);

        gpsWatcher = null;

    }

}
/* ==========================================
   GeoStamp Camera Pro
   gps.js - Part 2
========================================== */

/* ==========================================
   Reverse Geocoding
========================================== */

async function reverseGeocode(latitude, longitude) {

    try {

        const url =
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;

        const response = await fetch(url, {

            headers: {

                "Accept": "application/json"

            }

        });

        if (!response.ok) {

            throw new Error("Network Error");

        }

        const data = await response.json();

        const address = data.address || {};

        const village =
            address.village ||
            address.hamlet ||
            address.suburb ||
            "";

        const city =
            address.city ||
            address.town ||
            address.county ||
            "";

        const state =
            address.state || "";

        const country =
            address.country || "";

        currentAddress = [

            village,

            city,

            state,

            country

        ]

        .filter(Boolean)

        .join(", ");

        if (currentAddress === "") {

            currentAddress =
                data.display_name || "Unknown Location";

        }

        document.getElementById("address").textContent =
            currentAddress;

        updateStatus("Location Ready");

    }

    catch (error) {

        console.error(error);

        currentAddress = "Address unavailable";

        document.getElementById("address").textContent =
            currentAddress;

        updateStatus("Address Error");

    }

}

/* ==========================================
   Refresh Address Every 30 Seconds
========================================== */

setInterval(() => {

    if (currentLatitude && currentLongitude) {

        reverseGeocode(
            currentLatitude,
            currentLongitude
        );

    }

}, 30000);

/* ==========================================
   Auto Start GPS
========================================== */

window.addEventListener("load", () => {

    startGPS();

});
