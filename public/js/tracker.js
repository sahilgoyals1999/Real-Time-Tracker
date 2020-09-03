let map;
let markers = new Map();

var iconBase = "http://maps.google.com/mapfiles/kml/shapes/";

var icons = {
  car: {
    icon: iconBase + "cabs.png"
  },
  bike: {
    icon: iconBase + "motorcycling.png"
  },
};

document.addEventListener("DOMContentLoaded", () => {
  const options = {
    enableHighAccuracy: true,
    maximumAge: 0
  };
  const socket = io("/");

  setInterval(() => {
    navigator.geolocation.getCurrentPosition(pos => {
        const { latitude: lat, longitude: long } = pos.coords;
        socket.emit("updateLocation", { lat, long });
      },
      err => {
        console.error(err);
      },
      options
    );
    socket.emit("getLocations");
  }, 2000);

  socket.on("currentLocations", locations => {
    markers.forEach((marker, id) => {
      marker.setMap(null);
      markers.delete(id);
    });
  });
});

function initMap() {
  navigator.geolocation.getCurrentPosition(pos => {
      const { latitude: lat, longitude: long } = pos.coords
      var map = new google.maps.Map(document.getElementById("map"), {
        center: new google.maps.LatLng(lat, long),
        zoom: 10
      });
      var vehicles = [
        {
          position: new google.maps.LatLng(29.511719, 76.643383),
          type: "bike"
        },
        {
          position: new google.maps.LatLng(29.521790, 76.643480),
          type: "car"
        },
        {
          psition: new google.maps.LatLng(29.531900, 76.643800),
          type: "bike"
        },
        {
          position: new google.maps.LatLng(29.501999, 76.643999),
          type: "car"
        },
        {
          position: new google.maps.LatLng(29.542200, 76.644400),
          type: "car"
        }
      ];
      
      for (let i = 0; i < vehicles.length; i++) {
          var marker = new google.maps.Marker({
            position: vehicles[i].position,
            icon: icons[vehicles[i].type].icon,
            map: map
          });
      }
    },
      err => {
        console.error(err);
      }
  );
}
