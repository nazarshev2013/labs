const { createServer } = require('node:http');

// Дані за Варіантом 1: Електроніка (Inventory)
let INVENTORY = [
  { id: 1, name: 'Monitor', price: 500, qty: 10 },
  { id: 2, name: 'Mouse', price: 25, qty: 50 },
  { id: 3, name: 'Keyboard', price: 150, qty: 20 },
];

const PORT = process.env.PORT || 3000;
const HOSTNAME = process.env.HOSTNAME || "localhost";

const server = createServer((req, res) => {
  const method = req.method;
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  // 1. РЕДИРЕКТ: з головної на /inventory
  if (pathname === '/') {
    res.writeHead(302, { Location: '/inventory' });
    return res.end();
  }

  // 2. GET: Список товарів + фільтрація за ціною
  if (method === 'GET' && pathname === '/inventory') {
    const minPrice = parseFloat(parsedUrl.searchParams.get('minPrice'));
    let results = [...INVENTORY];

    if (!isNaN(minPrice)) {
      results = results.filter((p) => p.price >= minPrice);
    }

    res.statusCode = 200;
    return res.end(JSON.stringify(results));
  }

  // 3. POST: Додати товар (строга валідація)
  if (method === 'POST' && pathname === '/inventory') {
    let body = '';
    req.on('data', (chunk) => (body += chunk.toString()));
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        if (!data.name || typeof data.price !== 'number' || typeof data.qty !== 'number') {
          res.statusCode = 400;
          return res.end(JSON.stringify({ error: 'Invalid data' }));
        }
        const nextId = INVENTORY.length > 0 ? INVENTORY[INVENTORY.length - 1].id + 1 : 1;
        const newItem = { id: nextId, name: data.name, price: data.price, qty: data.qty };
        INVENTORY.push(newItem);
        res.statusCode = 201;
        res.end(JSON.stringify({ message: 'Created', item: newItem }));
      } catch (e) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
    return;
  }

  // 4. PATCH: Оновлення по id (крім id) 
  if (method === 'PATCH' && pathname.startsWith('/inventory/')) {
    const id = parseInt(pathname.split('/')[2]);
    let body = '';
    req.on('data', (chunk) => (body += chunk.toString()));
    req.on('end', () => {
      try {
        const index = INVENTORY.findIndex((p) => p.id === id);
        if (index === -1) {
          res.statusCode = 404;
          return res.end(JSON.stringify({ error: 'Not Found' }));
        }
        const updates = JSON.parse(body);
        delete updates.id; // Заборона зміни ID
        INVENTORY[index] = { ...INVENTORY[index], ...updates };
        res.statusCode = 200;
        res.end(JSON.stringify({ message: 'Updated', item: INVENTORY[index] }));
      } catch (e) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
    return;
  }

  // 5. DELETE: Видалити товар 
  if (method === 'DELETE' && pathname.startsWith('/inventory/')) {
    const id = parseInt(pathname.split('/')[2]);
    const originalLength = INVENTORY.length;
    INVENTORY = INVENTORY.filter((p) => p.id !== id);

    if (INVENTORY.length < originalLength) {
      res.statusCode = 200;
      res.end(JSON.stringify({ message: 'Deleted' }));
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: 'Not Found' }));
    }
    return;
  }

  // 404 для невідомих маршрутів
  res.statusCode = 404;
  res.end(JSON.stringify({ error: 'Route not found' }));
});

server.listen(PORT, HOSTNAME, () => {
  console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
});
