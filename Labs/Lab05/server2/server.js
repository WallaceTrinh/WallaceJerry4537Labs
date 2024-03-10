const http = require('http');
const mysql = require('mysql');
const url = require('url');

// Create a MySQL connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

// Connect to MySQL
connection.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Database connection established');
});

// Create the HTTP server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }
  
  if (path === '/api/insert' && req.method === 'POST') {
    // Handle POST request for insertion here
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const patients = JSON.parse(body);
        const insertQuery = 'INSERT INTO patients (name, dateOfBirth) VALUES ?';
        const values = patients.map(patient => [patient.name, patient.dateOfBirth]);

        const createTableQuery = `
          CREATE TABLE IF NOT EXISTS patients (
            patientid INT(11) AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100),
            dateOfBirth DATETIME
          ) ENGINE=InnoDB;
        `;

        connection.query(createTableQuery, err => {
          if (err) {
            console.error('Error creating table:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error creating table' }));
            return;
          }
          connection.query(insertQuery, [values], (err, result) => {
            if (err) {
              console.error('Error inserting data:', err);
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Error inserting data' }));
              return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Data inserted successfully', result }));
          });
        });
      } catch (error) {
        console.error('Error parsing JSON:', error);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error parsing JSON' }));
      }
    });
  } else if (path === '/api/query' && req.method === 'GET') {
    // Handle GET request for querying here
    const query = parsedUrl.query.query;
    
    if (!query.toLowerCase().startsWith('select')) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Only SELECT queries are allowed' }));
      return;
    }
    
    connection.query(query, (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error executing query' }));
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(results));
    });
  } else {
    // Handle incorrect endpoint or method
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
