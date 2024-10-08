const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3002;

const server = http.createServer((req, res) => {
  const filePath = path.join(__dirname, './.next/analyze/client.html');

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});