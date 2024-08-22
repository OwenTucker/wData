console.log("This is a popup!")

document.addEventListener('DOMContentLoaded', () => {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            console.log("Geolocation position: ", position);
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
        },
        (error) => {
            console.error("Geolocation error: ", error.message);
        }
    );
});

