// app.cjs - Prevents Astro from calling listen()
const http = require('http');
const path = require('path');

// Create a fake server that doesn't actually listen
class FakeServer {
  constructor() {
    this._callbacks = {};
  }

  on(event, callback) {
    this._callbacks[event] = callback;
    return this;
  }

  listen() {
    // Do nothing - cPanel handles the actual listening
    return this;
  }

  close() {
    // Do nothing
    return this;
  }
}

// Intercept http.createServer to return our fake server
const originalCreateServer = http.createServer;
http.createServer = function (requestListener) {
  const fakeServer = new FakeServer();
  if (requestListener) {
    fakeServer.on('request', requestListener);
  }

  // Store the real request handler
  module.exports.astroRequestHandler = requestListener;

  return fakeServer;
};

// Restore original after import
async function loadAstro() {
  try {
    // Import the Astro handler
    await import('./dist/server/entry.mjs');

    // Restore original createServer
    http.createServer = originalCreateServer;

    return module.exports.astroRequestHandler;
  } catch (err) {
    console.error('Failed to load Astro:', err);
    throw err;
  }
}

// The actual request handler for cPanel
async function requestHandler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  try {
    // Get or initialize the Astro handler
    if (!requestHandler.astroHandler) {
      requestHandler.astroHandler = await loadAstro();
    }

    // Call the Astro handler
    if (requestHandler.astroHandler) {
      await requestHandler.astroHandler(req, res);
    } else {
      throw new Error('Astro handler not initialized');
    }
  } catch (err) {
    console.error('Handler error:', err);
    res.writeHead(500);
    res.end('Internal Server Error: ' + err.message);
  }
}

// Export for cPanel
module.exports = requestHandler;