const AttendanceModel = require('../models/attendanceModel');



// Get all attendance records
async function getTodayAttendance(req, res) {

  console.log("request come brother " );
  try {
    const attendance = await AttendanceModel.getTodayAttendance();
    res.status(200).json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch attendance records',
      error: error.message
    });
  }
}


// Get all attendance records
async function getYesterdayAttendance(req, res) {

  console.log("request come brother " );
  try {
    const attendance = await AttendanceModel.getYesterdayAttendance();
    res.status(200).json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch attendance records',
      error: error.message
    });
  }
}



async function getAttendanceByDate(req, res) {
  const { date } = req.params;

  // Validate date format (YYYY-MM-DD)
  const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
  if (!dateRegex.test(date)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid date format. Please use YYYY-MM-DD format (e.g., 2025-03-19)'
    });
  }

  // Validate if date is valid
  const isValidDate = new Date(date).toString() !== 'Invalid Date';
  if (!isValidDate) {
    return res.status(400).json({
      success: false,
      message: 'Invalid date. Please provide a valid date'
    });
  }

  // Check if date is in future
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time part to compare dates only
  selectedDate.setHours(0, 0, 0, 0); // Reset time part for selected date as well

  if (selectedDate > today) { // Changed from >= to > to allow current date
    return res.status(400).json({
      success: false,
      message: 'Future dates are not allowed'
    });
  }

  console.log("request come brother with date:", date);
  try {
    const attendance = await AttendanceModel.getAttendanceByDate(date);
    res.status(200).json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch attendance records',
      error: error.message
    });
  }
}




// Get all attendance records
async function getAttendanceByEmpId(req, res) {
  const { empid ,month } = req.params;
 
  console.log("request come brother " ,empid,month );

  try {
    const attendance = await AttendanceModel.getAttendanceByEmpId(month ,empid);
    res.status(200).json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch attendance records',
      error: error.message
    });
  }
}



module.exports = {
  getTodayAttendance,
  getYesterdayAttendance,
  getAttendanceByDate,
  getAttendanceByEmpId
};