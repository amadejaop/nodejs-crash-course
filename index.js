/* const Logger = require('./logger');

const logger = new Logger();

// if you put ${data} instead of how it is now written below, the console log displays Called listener: [object Object]. WHY?
logger.on('message', data => console.log("Called listener:", data));

logger.log('Hello, World!');
logger.log('Hi!');
logger.log('Greetings!'); */

// -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
/* 
// If you use framework like Express.js it makes everything easier
const http = require('http');
const path = require('path');
const fs = require('fs');

// createServer method takes in a function which takes request and response
const server = http.createServer((req, res) => {
    // the browser is requesting the page from the server
    // console.log(req.url);
    // if you change what is written in res.end and then reload the page, it won't change, because you have to manually restart the server by pressing ctrl+c in the terminal and running node index.js again
    // this is where nodemon is useful: constantly watches server and automatically restarts the server when changes occur
    // it is NOT suggested you install nodemon globally
    // we don't want to use nodemon in deployment
    if (req.url === '/') {
        fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, content) =>{
            if (err) throw err;
            // writeHead: write to the headers
            // code 200: everything went ok
            res.writeHead(200, { "Content-Type": "text/html"});
            res.end(content);
        });
    }

    if (req.url === '/about') {
        fs.readFile(path.join(__dirname, 'public', 'about.html'), (err, content) =>{
            if (err) throw err;
            // writeHead: write to the headers
            // code 200: everything went ok
            res.writeHead(200, { "Content-Type": "text/html"});
            res.end(content);
        });
    }

    if (req.url === '/api/users') {
        // fetch data from database and serve that
        const users = [
            { name: "Bob Smith", age: 40},
            { name: "John Doe", age: 30}
        ];
        res.writeHead(200, { "Content-Type": "application/json"});
        // turn JS array of objects into json file
        res.end(JSON.stringify(users));
    } 
});

const PORT = process.env.PORT || 5000; // look for the environment variable for a port, OR run 5000 if there isn't one

server.listen(PORT, () => console.log(`Server running on port ${PORT}.`)); */

// -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-


const http = require('http');
const path = require('path');
const fs = require('fs');


const server = http.createServer((req, res) => {
    let filePath = path.join(
        __dirname, 
        'public', 
        req.url === '/' ? 'index.html' : req.url
    );

    // console.log(filePath);
    // res.end();

    // get extension of the file
    let extname = path.extname(filePath);

    // set initial content type
    let contentType = "text/html";

    // check the extension and set content type
    switch(extname) {
        case ".js":
            contentType = "text/javascript";
            break;
        case ".css":
            contentType = "text/css";
            break;
        case ".json":
            contentType = "application/json";
            break;
        case ".png":
            contentType = "image/png";
            break;
        case ".jpg":
            contentType = "image/jpg";
            break;
    }

    // load a file / read file
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code == "ENOENT") {
                // page not found
                fs.readFile(path.join(__dirname, 'public', '404.html'), (err, content) => {
                   res.writeHead(200, { 'Content-Type': 'text/html'});
                   res.end(content, 'utf-8');
                });
            } else {
                // some server error
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            // successful response
            res.writeHead(200, { "Content-Type": contentType });
            res.end(content, 'utf-8');
        }
    })
});

const PORT = process.env.PORT || 5000; // look for the environment variable for a port, OR run 5000 if there isn't one

server.listen(PORT, () => console.log(`Server running on port ${PORT}.`));