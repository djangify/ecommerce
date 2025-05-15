const path = require('path');

// Create a simple request handler
module.exports = async function requestHandler(req, res) {
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
    // Import and call the Astro handler directly
    const astroModule = await import('./dist/server/entry.mjs');

    // Check if there's a default export
    if (astroModule.default) {
      await astroModule.default(req, res);
    } else if (astroModule.handler) {
      await astroModule.handler(req, res);
    } else {
      // Look for any exported function
      const handler = Object.values(astroModule).find(item => typeof item === 'function');
      if (handler) {
        await handler(req, res);
      } else {
        throw new Error('No handler found');
      }
    }
  } catch (err) {
    console.error('Full error:', err);
    res.writeHead(500);
    res.end('Error: ' + err.message);
  }
};