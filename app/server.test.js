const assert = require('node:assert/strict');
const http = require('node:http');
const { after, before, test } = require('node:test');
const createServer = require('./server');

let server;
let baseUrl;

before(async () => {
  server = createServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
  });
});

function request(path) {
  return new Promise((resolve, reject) => {
    http.get(`${baseUrl}${path}`, (response) => {
      let body = '';
      response.setEncoding('utf8');
      response.on('data', (chunk) => { body += chunk; });
      response.on('end', () => resolve({
        statusCode: response.statusCode,
        contentType: response.headers['content-type'],
        body: JSON.parse(body)
      }));
    }).on('error', reject);
  });
}

test('GET /health responds with healthy status and JSON content type', async () => {
  const response = await request('/health');

  assert.equal(response.statusCode, 200);
  assert.equal(response.contentType, 'application/json');
  assert.deepEqual(response.body, { status: 'healthy' });
});

test('GET /api responds with application information', async () => {
  const response = await request('/api');

  assert.equal(response.statusCode, 200);
  assert.equal(response.contentType, 'application/json');
  assert.deepEqual(response.body, {
    message: 'Hello from Kubernetes!',
    application: 'k8s-api-demo',
    version: '1.0.0'
  });
});

test('unknown routes respond with 404 and a JSON error', async () => {
  const response = await request('/missing');

  assert.equal(response.statusCode, 404);
  assert.equal(response.contentType, 'application/json');
  assert.deepEqual(response.body, { message: 'Not found' });
});
