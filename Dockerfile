# Stage 1: Build
FROM node:22.21.1-alpine AS build
WORKDIR /app
COPY package.json yarn.lock ./
RUN corepack enable && yarn install --frozen-lockfile
COPY . .
RUN yarn build

# Stage 2: Runtime
FROM node:22.21.1-alpine AS runtime
WORKDIR /app

# Copiada de dependencias y build
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json

ENV HOST=0.0.0.0
ENV PORT=8080
EXPOSE 8080

CMD ["node", "./dist/server/entry.mjs"]
