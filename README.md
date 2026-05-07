# TheBoysMenswear – Run Guide (Windows)

## Prerequisites
- Node.js 18+ (recommended 20+). Check with:
  ```powershell
  node -v
  ```
- pnpm (preferred). If not installed:
  ```powershell
  corepack enable
  corepack prepare pnpm@latest --activate
  # or: npm i -g pnpm
  ```

## Setup
1. Create your environment file:
   ```powershell
   Copy-Item .env.local.example .env.local
   ```
   Then edit `.env.local` and set at least:
   - `MONGODB_URI` (e.g., `mongodb://localhost:27017` or your SRV URI)
   - `JWT_SECRET` (any random string for dev)
   - `NEXT_PUBLIC_APP_URL` (`http://localhost:3000` for local)

2. Install dependencies:
   ```powershell
   pnpm install
   ```

## Run (Development)
```powershell
pnpm dev
```
Open http://localhost:3000

## Build + Start (Production preview)
```powershell
pnpm build
pnpm start
```

## Lint (optional)
```powershell
pnpm lint
```

### Notes
- A MongoDB instance must be reachable via `MONGODB_URI`. For local dev, run MongoDB locally or use Atlas.
- Cookies are `secure` in production; for local dev they are non-secure by default.

## Docker (Containerized Full Project)

### 1) Start app + MongoDB with Docker Compose
```powershell
docker compose up --build -d
```

Open http://localhost:3000

Stop containers:
```powershell
docker compose down
```

### 2) Build Docker image manually
```powershell
docker build -t theboysmenswear:latest .
```

### 3) Push image to Docker Hub
Replace `<dockerhub-username>` with your Docker Hub username:
```powershell
docker login
docker tag theboysmenswear:latest <dockerhub-username>/theboysmenswear:latest
docker push <dockerhub-username>/theboysmenswear:latest
```

### 4) Pull and run from Docker Hub anywhere
```powershell
docker pull <dockerhub-username>/theboysmenswear:latest
docker run -d --name theboysmenswear \
  -p 3000:3000 \
  -e MONGODB_URI="mongodb://<your-mongo-host>:27017/theboysmenswear" \
  -e JWT_SECRET="<your-secret>" \
  -e ADMIN_CODE="ADMIN2024" \
  -e NEXT_PUBLIC_APP_URL="http://localhost:3000" \
  <dockerhub-username>/theboysmenswear:latest
```
