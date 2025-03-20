const express = require('express');
const {

  getTodayAttendance,
  getYesterdayAttendance,
  getAttendanceByDate,
  getAttendanceByEmpId
} = require('../controllers/attendanceController');

const router = express.Router();

// Get all attendance records
router.get('/get-today-attendance', getTodayAttendance);

router.get('/get-yesterday-attendance', getYesterdayAttendance);

router.get('/get-attendance-by-date/:date', getAttendanceByDate);


router.get('/get-attendance-by-empid/:month/:empid', getAttendanceByEmpId);



module.exports = router;