const fs = require('node:fs');
const path = require('node:path');

// Зчитуємо .env вручну
try {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach((line) => {
      const [key, value] = line.split('=');
      if (key && value) process.env[key.trim()] = value.trim();
    });
  }
} catch (err) {
  // Файл .env необов'язковий, якщо змінні є в системі
}

const config = {
  PORT: parseInt(process.env.PORT),
  HOSTNAME: process.env.HOSTNAME || 'localhost',
  NODE_ENV: process.env.NODE_ENV || 'development',
};

// Валідація [cite: 97-98]
if (
  isNaN(config.PORT) ||
  !config.HOSTNAME ||
  !['development', 'production'].includes(config.NODE_ENV)
) {
  console.error('Критична помилка: Перевірте змінні в .env (PORT, HOSTNAME, NODE_ENV)');
  process.exit(1); // Завершення з помилкою
}

module.exports = config;
