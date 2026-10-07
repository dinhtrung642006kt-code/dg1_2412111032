FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
COPY . .
RUN chown -R appuser:appgroup /app
USER appuser
EXPOSE 5000
CMD ["node", "app/server.js"]
