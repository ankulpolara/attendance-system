const db = require("../config/db");

// Get all attendance records
async function getTodayAttendance() {
  try {
    // Check if database connection and query method are available
    if (!db || !db.query) {
      throw new Error("Database connection not available");
    }

    // Execute query and handle potential undefined result
    const currentDate = new Date().toISOString().split("T")[0];
    const result = await db.query(
      `SELECT Tran_MachineRawPunchId ,CardNo ,PunchDatetime,MachineNo ,Dateime1 FROM Tran_MachineRawPunch WHERE CAST(PunchDatetime AS DATE) = '${currentDate}'`
    );

    // Verify if result exists and has rows
    if (!result || !Array.isArray(result) || result.length === 0) {
      return [];
    }

    const [rows] = result;

    // Verify if rows exists
    if (!rows) {
      console.log("No records found in yearlyPersent table");
      return [];
    }

    // console.log("Retrieved rows:", rows);
    return result;
  } catch (error) {
    console.error("Error in getAllYearlyPresent:", error.message);
    throw error;
  }
}

async function getYesterdayAttendance() {
  try {
    // Check if database connection and query method are available
    if (!db || !db.query) {
      throw new Error("Database connection not available");
    }

    // Execute query and handle potential undefined result
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayDate = yesterday.toISOString().split("T")[0];
    console.log("yesterday " , yesterdayDate);
    
    const result = await db.query(
      `SELECT Tran_MachineRawPunchId ,CardNo ,PunchDatetime,MachineNo ,Dateime1 FROM Tran_MachineRawPunch WHERE CAST(PunchDatetime AS DATE) = '${yesterdayDate}'`
    );

    // Verify if result exists and has rows
    if (!result || !Array.isArray(result) || result.length === 0) {
      return [];
    }

    const [rows] = result;

    // console.log("Retrieved rows:", rows);
    return result;
  } catch (error) {
    console.error("Error in getAllYearlyPresent:", error.message);
    throw error;
  }
}




async function getAttendanceByDate(date) {
  try {
    // Check if database connection and query method are available
    if (!db || !db.query) {
      throw new Error("Database connection not available");
    }

    // Execute query and handle potential undefined result

    const result = await db.query(
      `SELECT Tran_MachineRawPunchId ,CardNo ,PunchDatetime,MachineNo ,Dateime1 FROM Tran_MachineRawPunch WHERE CAST(PunchDatetime AS DATE) = '${date}'`
    );

    // Verify if result exists and has rows
    if (!result || !Array.isArray(result) || result.length === 0) {
      return [];
    }

    // console.log("Retrieved rows:", rows);
    return result;
  } catch (error) {
    console.error("Error in getAllYearlyPresent:", error.message);
    throw error;
  }
}



async function getAttendanceByEmpId(month ,empid) {
  try {
    // Check if database connection and query method are available
    if (!db || !db.query) {
      throw new Error("Database connection not available");
    }

    // Execute query and handle potential undefined result
const result = await db.query(`
  WITH DailyPunches AS (
    SELECT 
      CAST(PunchDatetime AS DATE) as punch_date,
      MIN(PunchDatetime) as check_in,
      MAX(PunchDatetime) as check_out,
      CONCAT(
        CAST(DATEDIFF(MINUTE, MIN(PunchDatetime), MAX(PunchDatetime)) / 60 AS INT),
        ':',
        RIGHT('0' + CAST(DATEDIFF(MINUTE, MIN(PunchDatetime), MAX(PunchDatetime)) % 60 AS VARCHAR), 2),
        ':00'
      ) as total_time
    FROM Tran_MachineRawPunch
    WHERE CardNo = ${empid}
    AND MONTH(PunchDatetime) = ${month}
    GROUP BY CAST(PunchDatetime AS DATE)
  )
  SELECT 
    t.Tran_MachineRawPunchId,
    t.CardNo,
    t.PunchDatetime,
    t.MachineNo,
    t.Dateime1,
    d.check_out as checkout_time,
    d.total_time
  FROM Tran_MachineRawPunch t
  JOIN DailyPunches d ON CAST(t.PunchDatetime AS DATE) = d.punch_date
  WHERE t.CardNo = ${empid}
  AND MONTH(t.PunchDatetime) = ${month}
  AND t.PunchDatetime = d.check_in
  ORDER BY t.PunchDatetime
`);

    // Verify if result exists and has rows
    if (!result || !Array.isArray(result) || result.length === 0) {
      return [];
    }

    // console.log("Retrieved rows:", rows);
    return result;
  } catch (error) {
    console.error("Error in getAllYearlyPresent:", error.message);
    throw error;
  }
}

module.exports = {
  getTodayAttendance,
  getYesterdayAttendance,
  getAttendanceByDate,
  getAttendanceByEmpId
};
