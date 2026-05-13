const { createServer } = require('node:http');
const config = require('./config');

let INVENTORY = [
  { id: 1, name: 'Monitor', price: 500, qty: 10 },
  { id: 2, name: 'Mouse', price: 25, qty: 50 },
  { id: 3, name: 'Keyboard', price: 150, qty: 20 },
];

// Логування у форматі JSON (Варіант 1) [cite: 120-122]
function logRequest(req, res, level = 'INFO') {
  const logData = {
    timestamp: new Date().toISOString(),
    level: level,
    method: req.method,
    url: req.url,
    status: res.statusCode,
  };

  const output = JSON.stringify(logData) + '\n';

  if (config.NODE_ENV === 'development') {
    process.stdout.write(output); // Усі запити в dev [cite: 101]
  } else if (config.NODE_ENV === 'production' && res.statusCode >= 400) {
    process.stderr.write(output); // Тільки помилки в prod [cite: 101]
  }
}

const server = createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  // Ендпоінт /health [cite: 116]
  if (req.method === 'GET' && pathname === '/health') {
    res.statusCode = 200;
    logRequest(req, res);
    return res.end(
      JSON.stringify({
        pid: process.pid,
        nodeVersion: process.version,
        platform: process.platform,
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
      }),
    );
  }

  // Маршрут /inventory (з Lab 1)
  if (pathname === '/inventory') {
    res.statusCode = 200;
    logRequest(req, res);
    return res.end(JSON.stringify(INVENTORY));
  }

  res.statusCode = 404;
  logRequest(req, res, 'WARN');
  res.end(JSON.stringify({ error: 'Not Found' }));
});

// Graceful Shutdown [cite: 103-110]
function gracefulShutdown(signal) {
  process.stdout.write(`\nСигнал ${signal}: закриваємо ресурси...\n`);

  const timer = setTimeout(() => {
    process.exit(1);
  }, 10000);

  server.close(() => {
    clearTimeout(timer);
    process.exit(0);
  });
}

// Обробка сигналів та помилок [cite: 107-115]
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

process.on('uncaughtException', (err) => {
  process.stderr.write(`Критична помилка: ${err.message}\n`);
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason) => {
  process.stderr.write(`Відхилений проміс: ${reason}\n`);
  gracefulShutdown('unhandledRejection');
});

server.listen(config.PORT, config.HOSTNAME, () => {
  process.stdout.write(`Сервер: http://${config.HOSTNAME}:${config.PORT}/ [${config.NODE_ENV}]\n`);
});
