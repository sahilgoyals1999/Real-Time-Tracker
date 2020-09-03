let map;
let markers = [];

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
      map = new google.maps.Map(document.getElementById("map"), {
        center: new google.maps.LatLng(lat, long),
        zoom: 10
      });
      var vehicles = [
        {
          lat: 29.511719,
          long: 76.743383,
          type: "car"
        },
        {
          lat: 29.521719,
          long: 76.75243383,
          type: "bike"
        },
        {
          lat: 29.241719,
          long: 76.6783383,
          type: "car"
        },
         {
          lat: 29.531719,
          long: 76.6033383,
          type: "car"
        },
        {
          lat: 29.351719,
          long: 76.53383,
          type: "bike"
        }
      ];
      
      for (let i = 0; i < vehicles.length; i++) {
          var marker = new google.maps.Marker({
            position: new google.maps.LatLng(vehicles[i].lat, vehicles[i].long),
            icon: icons[vehicles[i].type].icon,
            map: map
          });
          markers.push(marker);
      }

      setInterval(() => {
        for (let i = 0; i < vehicles.length; i++) {
          var marker = new google.maps.Marker({
            position: new google.maps.LatLng(vehicles[i].lat, vehicles[i].long),
            icon: icons[vehicles[i].type].icon,
            map: map
          });
          markers[i].setMap(null);
          markers[i]=marker;
          if(i%2==1) {
            vehicles[i].lat += 0.001;
            vehicles[i].lat += 0.001;
          } else {
            vehicles[i].lat -= 0.001;
            vehicles[i].lat += 0.001;
          }
      }
      }, 1000);
    },
      err => {
        console.error(err);
      }
  );
}
