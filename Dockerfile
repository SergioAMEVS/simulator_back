# Base image
FROM node:16-alpine3.17 as builder
# Set the working directory
WORKDIR /app
# Copy package.json and package-lock.json
COPY package*.json ./
# Install app dependencies
RUN npm install
# Copy app source code
COPY . .

RUN npm run build

FROM node:16-alpine3.17 as production

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev || npm ci --only=production --ignore-scripts

COPY --from=builder /app/dist .
# Expose a port if your app requires it #
EXPOSE 3000
# Start the app
CMD ["node", "main.js"]
