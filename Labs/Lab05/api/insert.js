// This is to handle the insertion of new patients, POST requests
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    // Handle error appropriately
  } else {
    console.log('Database connection established');
  }
});

module.exports = (req, res) => {
  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString(); // Convert Buffer to string
    });
    req.on('end', () => {
      try {
        const patients = JSON.parse(body);

        // Define insert query and values
        const insertQuery = 'INSERT INTO patients (name, dateOfBirth) VALUES ?';
        const values = patients.map(patient => [patient.name, patient.dateOfBirth]);

        // SQL query to create table if not exists
        const createTableQuery = `
          CREATE TABLE IF NOT EXISTS patients (
            patientid INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100),
            dateOfBirth DATE
          ) ENGINE=InnoDB;
        `;

        // Execute SQL query to create the table
        connection.query(createTableQuery, err => {
          if (err) {
            console.error('Error creating table:', err);
            res.statusCode = 500;
            res.end('Error creating table');
          } else {
            // Insert the patient data
            connection.query(insertQuery, [values], (err, result) => {
              if (err) {
                console.error('Error inserting data:', err);
                res.statusCode = 500;
                res.end('Error inserting data');
              } else {
                console.log('Data inserted successfully:', result);
                res.statusCode = 200;
                res.end(JSON.stringify({ message: 'Data inserted successfully', result }));
              }
            });
          }
        });
      } catch (error) {
        console.error('Error parsing JSON:', error);
        res.statusCode = 400;
        res.end('Error parsing JSON: ' + error.message);
      }
    });
  } else {
    console.log('Invalid method for insertion endpoint');
    res.statusCode = 405;
    res.end('Method Not Allowed');
  }
};

//         const insertQuery = 'INSERT INTO patients (name, dateOfBirth) VALUES ?';
//         const values = patients.map(patient => [patient.name, patient.dateOfBirth]);

//         // Executes the insertion query
//         connection.query(insertQuery, [values], (err, result) => {
//           if (err) {
//             console.error('Error inserting data:', err);
//             res.statusCode = 500;
//             res.end('Error inserting data');
//             return;
//           }
//           // No errors, data inserted successfully
//           res.statusCode = 200;
//           res.end(JSON.stringify({ message: 'Data inserted successfully', result }));
//         });
//       });
//     });
//   } else {
//     // Method not allowed
//     res.statusCode = 405;
//     res.end('Method Not Allowed');
//   }
// };
