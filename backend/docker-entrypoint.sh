#!/bin/sh
set -e

echo "Waiting for MySQL to be ready..."
for i in $(seq 1 30); do
  if node -e "
    const net = require('net');
    const client = new net.Socket();
    client.setTimeout(2000);
    client.connect(3306, 'mysql', function() {
      client.destroy();
      process.exit(0);
    });
    client.on('error', function() {
      client.destroy();
      process.exit(1);
    });
  " 2>/dev/null; then
    echo "MySQL is ready!"
    break
  fi
  echo "Waiting for MySQL... ($i/30)"
  sleep 2
done

echo "Running Prisma migrations..."
npx prisma migrate deploy

echo "Starting application..."
exec node dist/server.js
