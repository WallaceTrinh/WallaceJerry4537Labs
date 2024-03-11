const http = require('http');
const mysql = require('mysql');
const url = require('url');

// Create a MySQL connection
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'WallaceJerry',
  password: 'COMP4537WJ',
  database: 'lab05database'
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
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  } else{
    res.setHeader('Content-Type', 'application/json')
  }
  
  if (path === '/api/insert' && req.method === 'POST') {
    // Handle POST request for insertion here
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        // const patients = JSON.parse(body);
        // const insertQuery = 'INSERT INTO patients (name, dateOfBirth) VALUES ?';
        // const values = patients.map(patient => [patient.name, patient.dateOfBirth]);

        const query = JSON.parse(body);
        console.log(query);
        const createTableQuery = `
          CREATE TABLE IF NOT EXISTS patients (
            patientid INT(11) AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100),
            dateOfBirth DATETIME
          ) ENGINE=InnoDB;
        `;

        console.log("start of create table query");

        connection.query(createTableQuery, err => {
          if (err) {
            console.error('Error creating table:', err);
            // res.writeHead(500, { 'Content-Type': 'application/json' });
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Error creating table' }));
            return;
          }
          console.log("createtablequery ok");
          connection.query(query, (err, result) => {
            if (err) {
              console.error('Error inserting data:', err);
              // res.writeHead(500, { 'Content-Type': 'application/json' });
              res.statusCode = 500
              res.end(JSON.stringify({ error: 'Error inserting data' }));
              return;
            }
            console.log("insertquery ok");

            // res.writeHead(200, { 'Content-Type': 'application/json' });
            res.statusCode = 200;
            res.end(JSON.stringify({ message: 'Data inserted successfully', result }));
          });
        });
      } catch (error) {
        console.error('Error parsing JSON:', error);
        // res.writeHead(400, { 'Content-Type': 'application/json' });
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'Error parsing JSON' }));
      }
    });
  } else if (path === '/api/query' && req.method === 'GET') {
    // Handle GET request for querying here
    const query = parsedUrl.query.query;
    
    if (!query.toLowerCase().startsWith('select')) {
      // res.writeHead(400, { 'Content-Type': 'application/json' });
      res.statusCode = 400;
      res.end(JSON.stringify({ error: 'Only SELECT queries are allowed' }));
      return;
    }
    
    connection.query(query, (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        // res.writeHead(500, { 'Content-Type': 'application/json' });
        res.statusCode = 500;
        res.end(JSON.stringify({ error: 'Error executing query' }));
        return;
      }
      // res.writeHead(200, { 'Content-Type': 'application/json' });
      res.statusCode = 200;
      res.end(JSON.stringify(results));
    });
  } else {
    // Handle incorrect endpoint or method
    // res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.statusCode = 404;
    res.end('Not Found');
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
