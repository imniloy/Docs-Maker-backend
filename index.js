import { Server } from "socket.io";

const io = new Server(5000, {
  cors: true,
  methods: ["GET", "POST"],
});

io.on("connection", (socket) => {
  console.log("connection Established");
  socket.emit("Welcome", "Welcome");
});
