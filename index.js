import { Server } from "socket.io";
import expressServer from "./server.js";
import { findByIdOrCreate, update_doc_data } from "./controllers/docs.js";

const io = new Server(expressServer, {
  cors: true,

  maxHttpBufferSize: 1e8,

  methods: ["GET", "POST"],
});

io.on("connection", (socket) => {
  // console.log("connection Established" + socket.id);
  socket.on("joinRoom", async (data) => {
    try {
      const { id: docId, user } = data;
      socket.join(docId);
      const document = await findByIdOrCreate(docId, user);

      socket.emit("load-data", document);

      let timeoutId;

      socket.on("send-changes", (data) => {
        socket.broadcast.to(data.docId).emit("receive-changes", data);

        clearTimeout(timeoutId);

        socket.emit("saving_docs", { loading_state: true });
        timeoutId = setTimeout(async () => {
          let abc = await update_doc_data(data.docId, data.content);
          socket.emit("saving_docs", { loading_state: false });
        }, 3000);
      });

      socket.on("document-name-change", (data) => {
        socket.broadcast.to(data.docId).emit("new-document_name", data);
      });
    } catch (error) {
      console.log(error);
    }
  });
});

// Error handling for socket.io
io.on("error", (err) => {
  console.error("Socket.io server error:", err);
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
