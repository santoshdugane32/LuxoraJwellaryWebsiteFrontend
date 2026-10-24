
# 1. Build the React + Vite frontend
FROM node:22-alpine AS build

# 2. Set working directory
WORKDIR /app

# 3. Copy dependency files
COPY package*.json ./

# 4. Install dependencies
RUN npm ci

# 5. Copy frontend source code
COPY . .

# 6. Build production files into /app/dist
RUN npm run build

# 7. Production stage: Nginx serves the frontend
FROM nginx:alpine

# 8. Copy built React files into Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# 9. Expose HTTP port
EXPOSE 80

# 10. Start Nginx
CMD ["nginx", "-g", "daemon off;"]
