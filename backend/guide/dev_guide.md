# Hướng dẫn triển khai CodeFit Backend trên Server

> Ngày cập nhật: **30/05/2026**

## Mục lục

- [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
- [Phương án triển khai](#phương-án-triển-khai)
- [Triển khai với Docker (Khuyến nghị)](#triển-khai-với-docker-khuyến-nghị)
- [Triển khai không dùng Docker](#triển-khai-không-dùng-docker)
- [Cấu hình môi trường](#cấu-hình-môi-trường)
- [Khởi tạo Database](#khởi-tạo-database)
- [Seed Data](#seed-data)
- [Cấu hình Nginx](#cấu-hình-nginx)
- [SSL Certificate](#ssl-certificate)
- [Monitoring & Logs](#monitoring--logs)
- [Backup Database](#backup-database)
- [Troubleshooting](#troubleshooting)

---

## Yêu cầu hệ thống

### Phần cứng tối thiểu

| Thành phần | Tối thiểu | Khuyến nghị |
|------------|------------|--------------|
| CPU | 2 cores | 4+ cores |
| RAM | 4 GB | 8+ GB |
| Disk | 20 GB | 50+ GB SSD |
| OS | Ubuntu 20.04 LTS | Ubuntu 22.04 LTS |

### Phần mềm cần thiết

- Docker & Docker Compose v2+
- Git
- Nginx (để reverse proxy)
- Certbot (cho SSL)

---

## Phương án triển khai

### Phương án 1: Docker (Khuyến nghị)

- Container hóa đầy đủ với MySQL, Redis, RabbitMQ
- Hot-reload trong development
- Dễ quản lý và scale

### Phương án 2: Server trực tiếp

- Cài đặt Node.js, MySQL, Redis trên server
- Phù hợp với server đã có sẵn các dịch vụ

---

## Triển khai với Docker (Khuyến nghị)

### 1. Chuẩn bị Server

```bash
# Cập nhật hệ thống
sudo apt update && sudo apt upgrade -y

# Cài đặt Docker
curl -fsSL https://get.docker.com | sh

# Cài đặt Docker Compose
sudo apt install docker-compose-plugin

# Thêm user vào group docker
sudo usermod -aG docker $USER
```

### 2. Clone/Copy source code

```bash
# Tạo thư mục dự án
mkdir -p /opt/codefit
cd /opt/codefit

# Copy source code (hoặc git clone)
# cp -r /path/to/codefit-be /opt/codefit/

# Hoặc git clone
git clone https://github.com/your-repo/codefit-be.git /opt/codefit/codefit-be
```

### 3. Cấu hình Environment

```bash
cd /opt/codefit/codefit-be

# Tạo file .env từ template
cat > .env << 'EOF'
NODE_ENV=production
PORT=5000

# Database
DATABASE_URL="mysql://root:YOUR_PASSWORD@mysql:3306/codefit"

# Redis
REDIS_URL=redis://redis:6379

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this"

# Frontend URL (cho CORS)
FRONTEND_URL="https://your-domain.com"

# ImageKit
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your-instance

# Gemini AI
GEMINI_PROJECT_NAME=YourProjectName
GEMINI_ID_PROJECT=your-project-id
GEMINI_API_KEY=your-api-key

# Payment - PayOS
PAYOS_CLIENT_ID=your-client-id
PAYOS_API_KEY=your-api-key
PAYOS_CHECKSUM_KEY=your-checksum-key

# Payment - Sepay
SEPAY_MERCHANT_ID=your-merchant-id
SEPAY_SECRET_KEY=your-secret-key
SEPAY_IPN_URL=https://your-domain.com/api/payment/sepay/ipn

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=CodeFit <noreply@your-domain.com>
EOF
```

### 4. Chạy Docker Compose

```bash
cd /opt/codefit/codefit-be

# Build và chạy (Development mode - hot reload)
docker compose -f docker-compose.dev.yml up -d --build

# Hoặc Production mode
docker compose -f docker-compose.yml up -d --build
```

### 5. Kiểm tra Container

```bash
# Xem trạng thái các container
docker compose ps

# Xem logs
docker compose logs -f app

# Xem logs của service cụ thể
docker compose logs -f mysql
docker compose logs -f redis
```

### 6. Ports

| Service | Internal Port | External Port |
|---------|---------------|---------------|
| Backend API | 5000 | 5000 |
| MySQL | 3306 | 3308 |
| Redis | 6379 | 6380 |
| RabbitMQ | 5672 | 5673 |
| RabbitMQ Admin | 15672 | 15673 |

---

## Triển khai không dùng Docker

### 1. Cài đặt Node.js

```bash
# Cài đặt Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Kiểm tra version
node --version  # v20.x.x
npm --version   # 10.x.x
```

### 2. Cài đặt MySQL

```bash
# Cài đặt MySQL
sudo apt install -y mysql-server

# Khởi động MySQL
sudo systemctl start mysql
sudo systemctl enable mysql

# Cấu hình MySQL
sudo mysql_secure_installation

# Tạo database và user
sudo mysql -u root -p << 'EOF'
CREATE DATABASE codefit CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'codefit'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON codefit.* TO 'codefit'@'localhost';
FLUSH PRIVILEGES;
EOF
```

### 3. Cài đặt Redis

```bash
# Cài đặt Redis
sudo apt install -y redis-server

# Cấu hình Redis
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

### 4. Cài đặt PM2 (Process Manager)

```bash
# Cài đặt PM2 globally
sudo npm install -g pm2

# Tạo ecosystem file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'codefit-api',
    script: 'dist/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    env_production: {
      NODE_ENV: 'production'
    },
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    merge_logs: true,
    max_memory_restart: '1G'
  }]
};
EOF
```

### 5. Build và Chạy

```bash
cd /opt/codefit/codefit-be/backend

# Cài đặt dependencies
npm install

# Build TypeScript
npm run build

# Chạy migration
npx prisma migrate deploy

# Seed data (tùy chọn)
npm run db:seed

# Khởi chạy với PM2
pm2 start ecosystem.config.js --env production

# Lưu cấu hình PM2
pm2 save

# Cấu hình startup script
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp /home/$USER
```

---

## Cấu hình môi trường

### Biến môi trường bắt buộc

```env
# Application
NODE_ENV=production
PORT=5000

# Database
DATABASE_URL="mysql://user:password@localhost:3306/codefit"

# JWT (BẮT BUỘC thay đổi trong production)
JWT_SECRET="very-long-random-secret-key-min-32-chars"

# Frontend URL (cho CORS)
FRONTEND_URL="https://your-frontend-domain.com"
```

### Biến môi trường tùy chọn

```env
# Redis
REDIS_URL=redis://localhost:6379

# ImageKit
IMAGEKIT_PUBLIC_KEY=public_xxx
IMAGEKIT_PRIVATE_KEY=private_xxx
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your-instance

# Payment
PAYOS_CLIENT_ID=xxx
PAYOS_API_KEY=xxx
PAYOS_CHECKSUM_KEY=xxx

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=xxx
SMTP_PASS=xxx
```

---

## Khởi tạo Database

### Chạy Migration

```bash
# Development
npx prisma migrate dev

# Production
npx prisma migrate deploy
```

### Reset Database (CẨN THẬN!)

```bash
# Xóa toàn bộ dữ liệu và tạo lại
npx prisma migrate reset

# Chỉ reset không confirm
npx prisma migrate reset --force
```

---

## Seed Data

### Các loại seed

| Lệnh | Mô tả |
|-------|-------|
| `npm run db:seed` | Seed mặc định (cơ bản) |
| `npm run db:seed:full` | Seed đầy đủ (cho tester) |
| `npm run db:seed:admin` | Seed chỉ có 3 tài khoản admin |

### Chi tiết tài khoản seed

**Seed đầy đủ:**
- Admin: `admin1@codefit.edu.vn` / `admin123`
- Giảng viên: `thanh.nguyen@codefit.edu.vn` / `lecture123`
- Học viên: `student1@codefit.com` / `student123`

Xem chi tiết tại [prisma/seed-data.md](../prisma/seed-data.md)

---

## Cấu hình Nginx

### Cài đặt Nginx

```bash
sudo apt install -y nginx
```

### Tạo Nginx config

```bash
sudo nano /etc/nginx/sites-available/codefit
```

```nginx
server {
    listen 80;
    server_name api.your-domain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.your-domain.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/api.your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.your-domain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers off;

    # Client body size
    client_max_body_size 100M;

    # Proxy to Backend
    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300;
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
    }

    # Logs
    access_log /var/log/nginx/codefit_access.log;
    error_log /var/log/nginx/codefit_error.log;
}
```

### Kích hoạt site

```bash
sudo ln -s /etc/nginx/sites-available/codefit /etc/nginx/sites-enabled/
sudo nginx -t  # Kiểm tra cấu hình
sudo systemctl reload nginx
```

---

## SSL Certificate

### Cài đặt Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### Lấy SSL Certificate

```bash
sudo certbot --nginx -d api.your-domain.com
```

### Auto-renewal

```bash
# Kiểm tra certbot timer
sudo systemctl status certbot.timer

# Test renewal
sudo certbot renew --dry-run
```

---

## Monitoring & Logs

### PM2 Commands

```bash
# Xem processes
pm2 list
pm2 status

# Xem logs realtime
pm2 logs codefit-api

# Restart
pm2 restart codefit-api

# Stop
pm2 stop codefit-api

# Xem detailed info
pm2 show codefit-api
```

### Docker Logs

```bash
# Xem logs
docker compose logs -f

# Xem logs service cụ thể
docker compose logs -f app
docker compose logs -f mysql

# Xem logs với timestamps
docker compose logs -f -t
```

### Systemd Logs (nếu dùng systemd)

```bash
# Xem logs
sudo journalctl -u codefit-api -f

# Xem logs ngày cụ thể
sudo journalctl -u codefit-api --since "2024-01-01"
```

---

## Backup Database

### Script backup tự động

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/backups/codefit"
DB_NAME="codefit"
DB_USER="codefit"
DB_PASS="your_password"

# Tạo thư mục backup
mkdir -p $BACKUP_DIR

# Backup MySQL
mysqldump -u$DB_USER -p$DB_PASS $DB_NAME | gzip > $BACKUP_DIR/codefit_$DATE.sql.gz

# Xóa backup cũ hơn 7 ngày
find $BACKUP_DIR -name "codefit_*.sql.gz" -mtime +7 -delete

echo "Backup completed: codefit_$DATE.sql.gz"
```

### Cronjob backup hàng ngày

```bash
# Mở crontab
crontab -e

# Thêm dòng (backup lúc 2h sáng mỗi ngày)
0 2 * * * /opt/codefit/backup.sh >> /var/log/backup.log 2>&1
```

---

## Troubleshooting

### Lỗi thường gặp

#### 1. Container không start được

```bash
# Kiểm tra logs
docker compose logs -f app

# Kiểm tra trạng thái
docker compose ps

# Rebuild không cache
docker compose build --no-cache
docker compose up -d
```

#### 2. Lỗi kết nối Database

```bash
# Kiểm tra MySQL container
docker compose ps mysql

# Kiểm tra logs MySQL
docker compose logs mysql

# Kết nối thủ công vào MySQL
docker compose exec mysql mysql -uroot -p123456 codefit
```

#### 3. Lỗi Permission

```bash
# Sửa permission thư mục
sudo chown -R $USER:$USER /opt/codefit

# Docker volume permissions
docker compose down -v  # CẨN THẬN: xóa volumes
docker compose up -d
```

#### 4. Lỗi CORS

- Kiểm tra `FRONTEND_URL` trong .env
- Đảm bảo frontend URL chính xác (không có trailing slash)
- Kiểm tra Nginx proxy headers

#### 5. Lỗi JWT Token

- Đảm bảo `JWT_SECRET` trong .env không có khoảng trắng
- Token có有效期 (thường 7 ngày)

#### 6. Lỗi Memory

```bash
# Kiểm tra memory usage
free -h

# Kiểm tra Docker memory
docker stats

# Tăng memory limit trong Docker
# Thêm vào docker-compose.yml:
# services:
#   app:
#     deploy:
#       resources:
#         limits:
#           memory: 2G
```

### Kiểm tra health endpoint

```bash
curl http://localhost:5000/api/health
# Hoặc endpoint tương ứng của ứng dụng
```

### Reset hoàn toàn

```bash
# Stop và xóa containers
docker compose down

# Xóa volumes (CẨN THẬN!)
docker compose down -v

# Xóa images
docker compose down --rmi all

# Rebuild và chạy lại
docker compose up -d --build
```

---

## Liên hệ hỗ trợ

- Email: support@codefit.edu.vn
- Documentation: https://docs.codefit.edu.vn
