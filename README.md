# Express.js MVC API

Modular REST and GraphQL API built with Express.js, Mongoose, and Socket.IO. The project ships with JWT auth, Redis caching hooks, Swagger docs, Jest tests, Docker multi-stage builds, and a PM2 process file for production clustering.

## Features
- Layered MVC structure (routes → controllers → services → models) with centralized error handling and validation.
- MongoDB (Mongoose) data layer, Redis-ready utilities, and AWS S3 upload helpers.
- JWT auth + refresh tokens, role-based guards, Helmet, CORS, rate limiting, and request logging via Winston.
- REST endpoints under `/api`, GraphQL playground on `/graphql`, Swagger UI at `/docs`, and Socket.IO for realtime events.
- Tooling: nodemon + concurrently for DX, Jest + Supertest for testing, ESLint/Prettier, Husky + lint-staged.
- Container-ready: Dockerfile (multi-stage), `Dockerfile.prod`, docker-compose stack (app + Mongo + Redis), and PM2 ecosystem config.

## Prerequisites
- Node.js 20.x and npm 10.x
- MongoDB 7.x and Redis 7.x (local installs or Docker services)
- Optional: Docker Desktop (for container workflows)

## Local Installation & Setup
1. **Clone & install**
   ```bash
   git clone <repo-url> expressjs
   cd expressjs
   npm install
   ```
2. **Create your env file**
   ```bash
   cp .env.example .env
   ```
   - Set local-friendly values, e.g. `MONGO_URI=mongodb://127.0.0.1:27017/express_app`
     and `REDIS_URL=redis://127.0.0.1:6379`.
3. **Start MongoDB & Redis**
   - Native services: start `mongod` and `redis-server` however you normally manage them.
   - *Or* run ephemeral containers:
     ```bash
     docker run --name express-mongo -p 27017:27017 -d mongo:7
     docker run --name express-redis -p 6379:6379 -d redis:7-alpine
     ```
4. **Run the API locally** – once databases are up, use the commands in the next section
   (`npm run dev` for watch mode or `npm start` for a single process).

## Running the App
Once dependencies and environment variables are ready, choose one of these options (from the project root):

1. **Development mode** – best for local hacking (auto reload + live Swagger build):
   ```bash
   npm run dev
   ```
   This runs `nodemon src/server.js` and simultaneously watches `src/docs/swagger.js` to regenerate `src/docs/swagger-output.json`.

2. **Single-process start** – mimics a lightweight production server without clustering:
   ```bash
   npm start
   ```
   Useful when you want to run the compiled API exactly as it will behave in Docker/PM2 but without additional tooling.

3. **Verify the service** – when the server is up:
   - REST health check: `GET http://localhost:3000/api/health`
   - Infra health check: `GET http://localhost:3000/health`
   - Swagger docs: `http://localhost:3000/docs`
   - GraphQL playground: `http://localhost:3000/graphql`

## Testing & Quality
```bash
npm test          # Jest + Supertest suite (uses tests/setup.js)
npm run lint      # ESLint
npm run lint:fix
npm run format    # Prettier
```

## API & Docs
- Swagger UI: `http://localhost:3000/docs`
- Generate static OpenAPI JSON: `node scripts/generate-swagger.js`
- GraphQL endpoint/playground: `http://localhost:3000/graphql`
- Socket.IO server: same origin as HTTP server (`/socket.io`)

## Environment Variables
| Variable | Purpose | Default / Example |
| --- | --- | --- |
| `NODE_ENV` | `development`, `test`, or `production` | `development` |
| `PORT` | HTTP port | `3000` |
| `MONGO_URI`, `MONGO_URI_PROD` | Mongo connection strings | `mongodb://mongo:27017/express_app` |
| `JWT_SECRET`, `JWT_EXPIRES_IN` | Access token secret & TTL | `supersecretjwt`, `1d` |
| `REFRESH_TOKEN_SECRET`, `REFRESH_TOKEN_EXPIRES_IN` | Refresh token secret & TTL | `supersecretrt`, `7d` |
| `REDIS_URL` | Redis connection string | `redis://redis:6379` |
| `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `S3_BUCKET` | AWS creds for S3 uploads | — |
| `RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX` | Express rate limiter window/max | `60000`, `100` |
| `ALLOWED_ORIGINS` | Comma-separated list for CORS | `http://localhost:3000` |
| `LOG_LEVEL` | Winston log level | `info` |
| `SWAGGER_ENABLED` | Toggle `/docs` route | `true` |

## Docker & Compose
### Full stack (app + Mongo + Redis)
```bash
docker-compose up --build
```
- App exposed on `localhost:3000`.
- Data persists via the `mongo-data` volume.

### Standalone production image
```bash
docker build -t expressjs-mvc-api -f Dockerfile .
docker run -p 3000:3000 --env-file .env expressjs-mvc-api
```
`Dockerfile` uses a multi-stage build and prunes dev dependencies before running `pm2-runtime ecosystem.config.js`.

### Minimal production build
```bash
docker build -t expressjs-mvc-api:prod -f Dockerfile.prod .
```

## PM2 / Bare-Metal Deployment
1. Provision Node.js 20 and install dependencies on the host:
   ```bash
   npm ci --omit=dev
   ```
2. Copy `.env` (or `.env.production`) to the server. The app loads `.env.production` automatically when `NODE_ENV=production`.
3. Start via PM2 cluster mode:
   ```bash
   npx pm2 start ecosystem.config.js
   npx pm2 save
   ```
4. Configure a process manager (systemd/PM2 startup) and load balancer/SSL of your choice. Use `/health` for container/ALB health probes.

## Logging & Monitoring
- Structured logs are written to `logs/application-YYYY-MM-DD.log` via Winston DailyRotateFile. Ensure the `logs/` directory is writable in production (Dockerfile already covers this).
- Console logs remain enabled outside production for easier debugging.

## Project Structure
```
src/
  app.js            Express setup, middleware, docs mounting
  server.js         HTTP, Socket.IO, GraphQL, Apollo server bootstrap
  config/           Env, Mongo, Redis configs
  controllers/      Route handlers
  services/         Business logic
  models/           Mongoose schemas
  middlewares/      Auth, error handling, logging, validators
  docs/             Swagger definition + generated spec
  utils/            Logger, response helpers, Socket.IO wrapper, etc.
tests/              Jest + Supertest suites
```

## Helpful Scripts
- `npm run docs:watch` – rebuild Swagger spec whenever `src/docs/swagger.js` changes.
- `npm run prepare` – installs Husky hooks (auto-run after `npm install`).
- `scripts/generate-swagger.js` – one-off OpenAPI JSON generator (used in CI/CD).

You're ready to develop locally, run automated tests, or ship the API via Docker/PM2 using this guide. Let the docs or deployment steps drift? Update this README alongside config changes to keep future deploys frictionless.
