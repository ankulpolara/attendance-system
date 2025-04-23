const sql = require('mssql');

// Database configuration
const dbConfig = {
  // server: process.env.DB_HOST,
    server: "FDPC-SERVER\MSSQLF14",
  // user: process.env.DB_USER,
  user: "sa",
  // password: process.env.DB_PASSWORD,
  password: "Admin@123",
  // database: process.env.DB_NAME,
    database:"Realtime_Attendance1",
  options: {
    trustServerCertificate: true,
    enableArithAbort: true,
    encrypt: false,
    requestTimeout: 300000, // Increase timeout to 5 minutes
    connectionTimeout: 300000, // Increase connection timeout
    pool: {
      max: 10, // Maximum number of connections in the pool
      min: 0, // Minimum number of connections in the pool
      idleTimeoutMillis: 30000 // How long a connection can be idle before being released
    }
  }
};            

let pool;

const createPool = async () => {
  try {
    pool = await sql.connect(dbConfig);
    console.log('✅ SQL Server connection pool created successfully');
  } catch (error) {
    console.error('❌ Error creating SQL Server connection pool:', error.message);
  }
  return pool;
};

const getConnection = async () => {
  if (!pool) {
    pool = await createPool();
  }
  
  try {
    return pool;
  } catch (error) {
    console.error('❌ Error getting database connection:', error);
    throw error;
  }
};

const query = async (sql, params = []) => {
  if (!pool) {
    pool = await createPool();
  }
  
  try {
    const request = pool.request();
    
    // Add parameters if any
    params.forEach((param, index) => {
      request.input(`param${index}`, param);
    });
    
    const result = await request.query(sql);
    return result.recordset;
  } catch (error) {
    console.error('❌ Error executing query:', error.message);
    throw error;
  }
};

createPool(); // Initialize the pool when the module loads

// Add this function to get all tables
const getAllTables = async () => {
  try {
    const result = await query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_TYPE = 'BASE TABLE'
    `);
    console.log('Tables in database:', result);
    return result;
  } catch (error) {
    console.error('Error getting tables:', error.message);
    throw error;
  }
};

// getAllTables()




// ... existing code ...
  // getting  table colum from below function 
// const getTableFields = async (tableName) => {
//   try {
//     const result = await query(`
//       SELECT 
//         c.COLUMN_NAME,
//         c.DATA_TYPE,
//         c.CHARACTER_MAXIMUM_LENGTH,
//         c.IS_NULLABLE,
//         COLUMNPROPERTY(OBJECT_ID(c.TABLE_SCHEMA + '.' + c.TABLE_NAME), c.COLUMN_NAME, 'IsIdentity') as IS_IDENTITY,
//         (
//           SELECT TOP 1 tc.CONSTRAINT_TYPE
//           FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc
//           JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu 
//             ON tc.CONSTRAINT_NAME = kcu.CONSTRAINT_NAME
//           WHERE kcu.TABLE_NAME = c.TABLE_NAME 
//             AND kcu.COLUMN_NAME = c.COLUMN_NAME
//             AND tc.CONSTRAINT_TYPE = 'PRIMARY KEY'
//         ) as IS_PRIMARY_KEY
//       FROM INFORMATION_SCHEMA.COLUMNS c
//       WHERE c.TABLE_NAME = @param0
//       ORDER BY c.ORDINAL_POSITION
//     `, [tableName]);
    
//     console.log(`Fields in table ${tableName}:`, result);
//     return result;
//   } catch (error) {
//     console.error(`Error getting fields for table ${tableName}:`, error.message);
//     throw error;
//   }
// };




// // Example usage:
// getTableFields('Tran_MachineRawPunch')
//   .then(fields => {
//     console.log(fields);
//   })
//   .catch(err => {
//     console.error(err);
//   });

// // ... existing exports ...
// module.exports = { query, getConnection, pool, getAllTables, getTableFields };



// Add getAllTables to exports
module.exports = { query, getConnection, pool, getAllTables };
