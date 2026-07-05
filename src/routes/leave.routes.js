const express = require("express");

const router = express.Router();

const leaveController = require("../controllers/leave.controller");

const authenticate = require("../middlewares/auth.middleware");

const authorize = require("../middlewares/role.middleware");

router.post("/", authenticate, leaveController.applyLeave);

router.get("/pending", authenticate, authorize(3, 4, 5), leaveController.getPendingLeaves);

router.get("/my-history", authenticate, leaveController.getMyLeaveHistory);

router.get("/my-balance", authenticate, leaveController.getMyLeaveBalance);

router.get("/", authenticate, authorize(3, 4), leaveController.getAllLeaves);

router.get("/dashboard", authenticate, authorize(3, 4), leaveController.getLeaveDashboard);

router.patch("/:id/approve", authenticate, authorize(3, 4), leaveController.approveLeave);

router.patch("/:id/reject", authenticate, authorize(3, 4), leaveController.rejectLeave);

router.patch("/:id/cancel", authenticate, leaveController.cancelLeave);

module.exports = router;

