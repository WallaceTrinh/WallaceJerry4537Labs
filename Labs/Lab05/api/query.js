// To handle the SELECT Queries
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

module.exports = (req, res) => {
  if (req.method === 'GET') {
    console.log('Received GET request for querying.');
    const query = req.query.query;
    console.log('Query:', query);

    // Validate that it's a SELECT query
    if (!query.toLowerCase().startsWith('select')) {
      res.statusCode = 400;
      res.end('Only SELECT queries are allowed');
      return;
    }

    // Executes the query
    connection.query(query, (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.statusCode = 500;
        res.end('Error executing query: ' + err.message);
        return;
      }
      console.log('Query executed successfully:', results);
      // No errors, it works
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(results));
    });
  } else {
    // Method is not allowed
    console.log('Invalid method for query endpoint');
    res.statusCode = 405;
    res.end();
  }
};
