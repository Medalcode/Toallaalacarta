# Stage 1: Build
FROM node:lts-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
# Usamos npm install en lugar de ci si no hay package-lock.json consistente, pero ci es mejor para CI/CD.
# Asumidremos que package-lock.json podría no existir o no estar sincronizado, pero intentaremos instalar.
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Runtime
FROM node:lts-alpine AS runtime
WORKDIR /app

# Copiada de dependencias y build
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json

ENV HOST=0.0.0.0
ENV PORT=8080
EXPOSE 8080

CMD ["node", "./dist/server/entry.mjs"]
