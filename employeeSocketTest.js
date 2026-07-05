const { io } = require("socket.io-client");

const socket = io("http://localhost:5000");

socket.on("connect", () => {
    console.log("✅ Employee Connected:", socket.id);

    const employeeId = Number(process.argv[2]);

    socket.emit("register", {
        id: employeeId,
        role: "EMPLOYEE_" + employeeId,
    });
});

socket.on("leaveApproved", (data) => {
    console.log("🎉 Leave Approved!");
    console.log(data);
});

socket.on("leaveRejected", (data) => {
    console.log("❌ Leave Rejected!");
    console.log(data);
});