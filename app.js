const express = require("express");
const http = require("http");
const path = require("path");
const app = express();
const server = http.Server(app);
var io = require("socket.io")(server);

let locationMap = new Map();

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.send("Server is Running");
});

io.on("connection", socket => {

  socket.on("updateLocation", pos => {
    locationMap.set(socket.id, pos);
  });

  socket.on("getLocations", () => {
    socket.emit("currentLocations", Array.from(locationMap));
  });

  socket.on("disconnect", () => {
    locationMap.delete(socket.id);
  });

});

server.listen(3000);
