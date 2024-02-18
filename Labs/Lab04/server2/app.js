// Importing Node.js modules
const http = require('http');
const url = require('url');

// A class for the dictionary server
class DictionaryServer {
    // Initialization of the dictionary object and a counter for total requests
    constructor() {
        this.dictionary = {}; // Store the words and their definitions
        this.totalRequests = 0; // Count the total of requests handled
    }

    // Method to start the server on a port
    start(port) {
        // Creating an HTTP server and defining request handler
        const server = http.createServer((req, res) => this.handleRequest(req, res));
        // Listneing on the port
        server.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    }

    handleRequest(req, res) {
        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        // HTTP methods, used for CORS request
        res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS'); 
        // Headers for CORS
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, requestNumber');
        // Allow credentials to be sent with requests (cookies)
        res.setHeader('Access-Control-Allow-Credentials', 'true');

        // Handle OPTIONS method CORS preflight requests
        if (req.method === 'OPTIONS') {
            res.writeHead(200);
            res.end();
            return;
        }

        // Parsing the URL to work with a path name and query
        const parsedUrl = url.parse(req.url, true);
        const pathname = parsedUrl.pathname;

        // Handle POST requests to add a new definition
        if (req.method === 'POST' && pathname === '/api/definitions/') {
            this.handlePostRequest(req, res);
            return;
        }

        // Handle GET Requests to search for a word's definition
        if (req.method === 'GET' && pathname === '/api/definitions/') {
            this.handleGetRequest(parsedUrl.query, res);
            return;
        }

        // Responding with 404 error for any other routes that are not handled
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
    }

    // Handles POST requests to add a new word and definition
    handlePostRequest(req, res) {
        this.totalRequests++;

        let data = ''; // Buffer to collect incoming data
        req.on('data', chunk => {
            data += chunk.toString(); // Accumulate the data chunks
        });

        // If all data is received, process it
        req.on('end', () => {
            const { word, definition } = JSON.parse(data);

            // Checks if it is a valid input
            if (!word || !definition || typeof word !== 'string' || typeof definition !== 'string') {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid input. Word and definition must be non-empty strings.' }));
                return;
            }

            // Checks if the word exists in the dictionary
            if (this.dictionary[word]) {
                res.writeHead(409, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: `Warning! '${word}' already exists.` }));
                return;
            }

            // Adds the new word and definition to the dictionary
            this.dictionary[word] = definition;
            // Calculate the total number of entries in the dictionary
            const totalEntries = Object.keys(this.dictionary).length;

            // Respond with success message, request count, and the total entries
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                message: 'Definition added successfully!',
                requestNumber: this.totalRequests,
                totalEntries
            }));
        });
    }

    // Handles GET requests to search for a word's definition
    handleGetRequest(query, res) {
        const word = query.word; // Extract the word to search for within the query parameters

        // Validating the input if it is a string
        if (!word || typeof word !== 'string') {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid input. The word must be a non-empty string.' }));
            return;
        }

        // Attempt to find the definition from the dictionary
        const definition = this.dictionary[word];

        // If the word isn't found, give 404 error
        if (!definition) {
            res.writeHead(404, {
                'Content-Type': 'application/json',
                'Access-Control-Expose-Headers': 'requestNumber'
            });
            res.end(JSON.stringify({
                error: `Request# ${this.totalRequests}, Word '${word}' not found!`,
                requestNumber: this.totalRequests
            }));
            return;
        }

        // Success if found, send a 200 OK response with word, definition and request number
        res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Expose-Headers': 'requestNumber'
        });
        res.end(JSON.stringify({
            word,
            definition,
            requestNumber: this.totalRequests
        }));
    }
}

const dictionaryServer = new DictionaryServer();
dictionaryServer.start(8888);
