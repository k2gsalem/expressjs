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

## Local Setup
1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Create your env file**
   ```bash
   cp .env.example .env
   # edit the new file with your secrets
   ```
3. **Start MongoDB & Redis** (locally or via `docker-compose` below).

## Running the App
- **Development (auto reload + live Swagger generation)**
  ```bash
  npm run dev
  ```
  Runs `nodemon src/server.js` and watches `src/docs/swagger.js` to regenerate `src/docs/swagger-output.json`.

- **Standard start**
  ```bash
  npm start
  ```

- **Health checks**
  - REST health: `GET /api/health`
  - Infra health: `GET /health` (returns uptime payload)

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
