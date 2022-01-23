const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const port = process.env.PORT || 4000;

app.use(bodyParser.json());

// log every request to the console
app.use((req, res, next) => {
  console.log(
    `${req.method} request for '${req.url}' - ${JSON.stringify(req.body)}`
  );
  next();
});

let messages = ["test1", "test2", "test3", "test4"];

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("chat message", (msg) => {
    console.log(`Chat message recived: ${msg}`);
    messages.push(msg);
    io.emit("messages", messages);
  });
});

app.post("/api/message", function (req, res, next) {
  messages.push(req.body.message);
  console.log(`Message recived: ${req.body.message}`);
  res.send({ message: req.body.message });
});

app.get("/api/messages", function (req, res, next) {
  res.send({ messages: messages });
});

// listen for requests :)
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
