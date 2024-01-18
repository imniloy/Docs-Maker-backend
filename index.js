import { Server } from "socket.io";

const io = new Server(5000, {
  cors: true,
  methods: ["GET", "POST"],
});

io.on("connection", (socket) => {
  console.log("connection Established");

  socket.on("send-changes", (data) => {
    console.log(data);
    socket.broadcast.emit("receive-changes", data);
  });

  socket.emit("Welcome", "Welcome");
});
