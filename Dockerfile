FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install --production=false
COPY . .

FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
COPY --from=base /app /app
RUN npm prune --omit=dev
EXPOSE 3000
CMD ["npx", "pm2-runtime", "ecosystem.config.js"]
