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

echo "Checking if database needs seeding..."
DATA_COUNT=$(node -e "
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  prisma.user.count().then(count => {
    console.log(count);
    prisma.\$disconnect();
  }).catch(() => { console.log('0'); process.exit(1); });
" 2>/dev/null || echo "0")

echo "Current user count: $DATA_COUNT"

if [ "$DATA_COUNT" = "0" ] || [ -z "$DATA_COUNT" ]; then
  echo "Database is empty - running seed..."
  npx tsx prisma/seed.ts
  echo "Seeding completed!"
else
  echo "Database already has data - skipping seed (preserving existing data)"
fi

echo "Starting application..."
exec npx tsx watch --watch server.ts
