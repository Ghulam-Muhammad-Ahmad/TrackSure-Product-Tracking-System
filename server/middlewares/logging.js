import fs from 'fs';

const loggingMiddleware = (req, res, next) => {
  const chunks = [];

  // Capture response body
  const originalSend = res.send;
  res.send = function (body) {
    chunks.push(body);
    return originalSend.call(this, body);
  };

  // Log on response finish
  
  res.on('finish', () => {
    const log = {
      time: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      status: res.statusCode,
      requestBody: req.body,
      responseBody: chunks.length ? chunks[0] : null
    };

    fs.appendFileSync('log.log', JSON.stringify(log) + '\n');
  });

  // Log on error
  res.on('error', (err) => {
    const errorLog = `${new Date().toISOString()} - ERROR - ${req.method} ${req.originalUrl} - ${req.ip} - ${err.message}`;
    fs.appendFileSync('log.log', errorLog + '\n');
  });

  next();
};

export default loggingMiddleware;
