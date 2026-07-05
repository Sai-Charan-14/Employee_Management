const leaveService = require("../services/leave.service");

const applyLeave = async (req, res) => {
    try {
        const leave = await leaveService.applyLeave(req.body, req.user);

        res.status(201).json({
            success: true,
            message: "Leave request submitted successfully",
            data: leave,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const getPendingLeaves = async (req, res) => {
  try {
    const pendingLeaves = await leaveService.getPendingLeaves();

    return res.status(200).json({
      success: true,
      count: pendingLeaves.length,
      data: pendingLeaves,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const approveLeave = async (req, res) => {
  try {

    const leave = await leaveService.approveLeave(req.params.id, req.user);

    return res.status(200).json({
      success: true,
      message: "Leave approved successfully",
      data: leave,
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message,
    });

  }
};

const rejectLeave = async (req, res) => {
  try {

    const leave = await leaveService.rejectLeave(req.params.id, req.user);

    return res.status(200).json({
      success: true,
      message: "Leave rejected successfully",
      data: leave,
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message,
    });

  }
};

const getMyLeaveHistory = async (req, res) => {

  try {

    const leaves = await leaveService.getMyLeaveHistory(req.user);

    return res.status(200).json({
      success: true,
      count: leaves.length,
      data: leaves,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

const getMyLeaveBalance = async (req, res) => {

  try {

    const leaveBalance = await leaveService.getMyLeaveBalance(req.user);

    return res.status(200).json({
      success: true,
      count: leaveBalance.length,
      data: leaveBalance,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

const cancelLeave = async (req, res) => {

  try {

    const leave = await leaveService.cancelLeave(
      req.params.id,
      req.user
    );

    return res.status(200).json({
      success: true,
      message: "Leave cancelled successfully",
      data: leave,
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message,
    });

  }

};

const getAllLeaves = async (req, res) => {

  try {

    const leaves = await leaveService.getAllLeaves();

    return res.status(200).json({
      success: true,
      count: leaves.length,
      data: leaves,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

const getLeaveDashboard = async (req, res) => {

  try {

    const dashboard = await leaveService.getLeaveDashboard();

    return res.status(200).json({
      success: true,
      data: dashboard,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

module.exports = {
    applyLeave,
    getPendingLeaves,
    getMyLeaveHistory,
    getMyLeaveBalance,
    approveLeave,
    rejectLeave,
    cancelLeave,
    getAllLeaves,
    getLeaveDashboard,
};