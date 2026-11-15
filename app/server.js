const http = require('http');

function createServer() {
  return http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');

    if (req.url === '/health') {
      res.writeHead(200);
      return res.end(JSON.stringify({ status: 'healthy' }));
    }

    if (req.url === '/api') {
      res.writeHead(200);
      return res.end(JSON.stringify({
        message: 'Hello from Kubernetes!',
        application: 'k8s-api-demo',
        version: '1.0.0'
      }));
    }

    res.writeHead(404);
    res.end(JSON.stringify({ message: 'Not found' }));
  });
}

if (require.main === module) {
  createServer().listen(3000, '0.0.0.0', () => {
    console.log('API listening on port 3000');
  });
}

module.exports = createServer;