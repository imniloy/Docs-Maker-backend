import { Server } from "socket.io";
import expressServer from "./server.js";

const io = new Server(expressServer, {
  cors: true,
  methods: ["GET", "POST"],
});

io.on("connection", (socket) => {
  console.log("connection Established" + socket.id);
  socket.on("joinRoom", (docId) => {
    socket.join(docId);

    socket.on("send-changes", (data) => {
      socket.broadcast.to(data.docId).emit("receive-changes", data);
    });
  });

  // socket.on("disconnect", () => {
  //   console.log("User disconnected");
  // });
});

// const notes = new Map();

// io.on("connection", (socket) => {
//   console.log("User connected");

//   socket.on("joinRoom", (noteId) => {
//     console.log(noteId);
//     // Join the room associated with the note
//     socket.join(noteId);

//     socket.on("send-changes", (data) => {
//       console.log(data);
//       socket.broadcast.to(noteId).emit("receive-changes", data);
//     });

//     // Create a new note entry if not exists
//     if (!notes.has(noteId)) {
//       notes.set(noteId, { content: "" });
//     }

//     // Emit the current note content to the user
//     const note = notes.get(noteId);
//     socket.emit("noteContent", "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
//   });

//   // socket.on("updateNote", ({ noteId, content }) => {
//   //   // Update the note content
//   //   const note = notes.get(noteId);
//   //   note.content = content;

//   //   // Broadcast the updated note content to all users in the room
//   //   socket.to(noteId).broadcast.emit("noteContent", content);
//   // });

//   socket.on("updateNote", ({ noteId, content }) => {
//     console.log(content);
//     // Update the note content
//     const note = notes.get(noteId);
//     note.content = content;

//     // Broadcast the updated note content to all users in the room except the user who initiated the change
//     // socket.broadcast.to(noteId).emit("noteContent", content);
//     socket.to(noteId).emit("noteContent", content);
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected");
//   });
// });

// Error handling for socket.io
io.on("error", (err) => {
  console.error("Socket.io server error:", err);
});
