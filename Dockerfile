# Build Stage
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production Stage
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

# Copia os arquivos compilados do frontend
COPY --from=build /app/dist ./dist

# Copia o código do servidor
COPY server.js ./

EXPOSE 3000

CMD ["node", "server.js"]
