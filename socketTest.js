const { io } = require("socket.io-client");

const socket = io("http://localhost:5000");

socket.on("connect", () => {
  console.log("✅ Connected:", socket.id);

  console.log("Sending register event...");

  socket.emit("register", {
    id: 5,
    role: "ADMIN",
  });
});

socket.on("newLeaveRequest", (data) => {
  console.log("📢 New Leave Request Received!");
  console.log(data);
});

socket.on("disconnect", () => {
  console.log("❌ Disconnected");
});

socket.on("connect_error", (err) => {
  console.log("Connection Error:", err.message);
});