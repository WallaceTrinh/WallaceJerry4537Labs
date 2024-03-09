// This is to handle the insertion of new patients, POST requests
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

module.exports = (req, res) => {
  if (req.method === 'POST') {
    let body = '';

    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', () => {
      const data = JSON.parse(body);

      // SQL query to create table if not exists
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS patients (
          patientid INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100),
          dateOfBirth DATE
        ) ENGINE=InnoDB;
      `;

      // Execute SQL query to the create table
      connection.query(createTableQuery, (err, result) => {
        if (err) {
          console.error('Error creating table:', err);
          res.statusCode = 500;
          res.end('Error creating table');
          return;
        }

        // Prepares the insertion query
        const insertQuery = 'INSERT INTO patients (name, dateOfBirth) VALUES ?';
        const values = data.map(patient => [patient.name, patient.dateOfBirth]);

        // Executes the insertion query
        connection.query(insertQuery, [values], (err, result) => {
          if (err) {
            console.error('Error inserting data:', err);
            res.statusCode = 500;
            res.end('Error inserting data');
            return;
          }
          // No errors, it works
          res.statusCode = 200;
          res.end('Data inserted successfully');
        });
      });
    });
  } else {
    // Method is not allowed
    res.statusCode = 405;
    res.end();
  }
};
