# 1. Choose a lightweight base image containing Node.js
FROM node:22-alpine

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy only dependency files first to utilize caching
COPY package*.json ./

# 4. Install your project dependencies
RUN npm install

# 5. Copy the remaining frontend code into the container
COPY . .

# 6. Expose the port your local dev server runs on (e.g., 3000 or 5173 for Vite)
EXPOSE 5173

# 7. Define the runtime command to launch your app
CMD ["npm", "run", "dev","--","--host"]  
# -- --host: Crucial for Vite. Vite defaults to listening on localhost, which isolates it inside the container. 
# Adding --host forces it to listen to all network traffic so Docker can expose it to your computer.
